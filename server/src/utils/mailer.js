const nodemailer = require("nodemailer");
const env = require("../config/env");

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465, // true for 465, false for other ports
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 */
async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: env.smtpFrom,
      to,
      subject,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    if (env.smtpHost.includes("ethereal.email")) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = { sendEmail };
