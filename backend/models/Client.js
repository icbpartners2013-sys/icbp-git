const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: ["Business Tax", "Personal Tax", "Other"],
      required: true,
    },

    name: String,
    phone: String,
    email: String,
    suburb: String,

    // Business Tax Fields
    companyName: String,
    registrationNumber: String,

    // Personal Tax Fields
    idNumber: String,
    employer: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Client", ClientSchema);
