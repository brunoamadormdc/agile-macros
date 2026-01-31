const Stripe = require("stripe");
const User = require("../models/User");
const env = require("../config/env");

// Initialize Stripe with the Secret Key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payment/create-checkout-session
 * Creates a checkout session for the user to subscribe to "Plus".
 */
exports.createCheckoutSession = async (req, res) => {
  try {
    const user = req.user; // From requireAuth middleware

    // 1. Get or Create Stripe Customer
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString(),
        },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // 2. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_PLUS,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/cancel`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

/**
 * POST /api/payment/create-portal-session
 * Creates a portal session for the user to manage their subscription.
 */
exports.createPortalSession = async (req, res) => {
  try {
    const user = req.user;

    if (!user.stripeCustomerId) {
      return res
        .status(400)
        .json({ error: "No connection with payment provider found." });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/plans`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Portal Error:", error);
    res.status(500).json({ error: "Failed to create portal session" });
  }
};

/**
 * POST /webhook
 * Handles Stripe events.
 * Note: req.body MUST be raw buffer here.
 */
exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify signature using the raw body
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;

      default:
        // Unhandled event type
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error(`Webhook Handling Error: ${err.message}`);
    res.status(500).send("Webhook handler failed");
  }
};

// --- Helper Handlers ---

async function handleCheckoutSessionCompleted(session) {
  // session.customer -> customer ID
  // session.subscription -> subscription ID
  // session.metadata.userId -> Our DB ID (if passed)

  const userId = session.metadata?.userId;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  if (userId) {
    const user = await User.findById(userId);
    if (user) {
      user.stripeCustomerId = customerId;
      user.stripeSubscriptionId = subscriptionId;
      user.subscriptionStatus = "active";
      user.plan = "plus";
      // Credits logic: Plus is unlimited (9999), see checkAndRenewCredits in routes/index.js
      // We don't set credits here because checking plan='plus' should imply unlimited in logic
      // But we can set a high number for safety or consistency.
      user.credits = 9999;
      await user.save();
      console.log(`User ${userId} upgraded to Plus via Checkout.`);
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  // This is fired on recurring renewals too.
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;

  // Find user by stripe ID
  const user = await User.findOne({ stripeCustomerId: customerId });
  if (user) {
    user.subscriptionStatus = "active";
    // Ensure plan is plus (in case it was somehow free but paid?)
    user.plan = "plus";

    // Retrieve subscription details to update end date
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);

    await user.save();
    console.log(
      `User ${user._id} payment succeeded. Extended to ${user.subscriptionEndDate}`,
    );
  }
}

async function handleInvoicePaymentFailed(invoice) {
  const customerId = invoice.customer;
  const user = await User.findOne({ stripeCustomerId: customerId });
  if (user) {
    user.subscriptionStatus = "past_due";
    // We might NOT downgrade immediately; usually we wait for smart retries or 'subscription.deleted' (which happens after retries fail)
    await user.save();
    console.log(`User ${user._id} payment failed. Status: past_due`);
  }
}

async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;
  const user = await User.findOne({ stripeCustomerId: customerId });
  if (user) {
    // DOWNGRADE LOGIC
    user.plan = "free";
    user.subscriptionStatus = "canceled";
    user.stripeSubscriptionId = null;

    // Strict Reset to 0 credits as requested
    user.credits = 0;

    await user.save();
    console.log(
      `User ${user._id} subscription canceled. Downgraded to Free/0 credits.`,
    );
  }
}

async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;
  const user = await User.findOne({ stripeCustomerId: customerId });
  if (user) {
    user.subscriptionStatus = subscription.status;
    user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
    // If Stripe says canceled here (it might), ensure logic triggers?
    // Usually 'deleted' event is safer for final cancellation.
    // 'updated' can handle 'active', 'past_due', 'unpaid'.

    if (
      subscription.status === "canceled" ||
      subscription.status === "unpaid"
    ) {
      // Maybe downgrade? 'unpaid' usually means all retries failed.
      // We can be strict here too if 'unpaid'.
      if (subscription.status === "unpaid") {
        user.plan = "free";
        user.credits = 0;
      }
    }

    await user.save();
  }
}
