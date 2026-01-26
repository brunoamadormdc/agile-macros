const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    observation: { type: String },
    planOfInterest: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "contacted", "converted"],
      default: "new",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lead", LeadSchema);
