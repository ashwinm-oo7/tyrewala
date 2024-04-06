const mongoose = require("mongoose");

// Define the schema for the  model
const brandSchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  subCategoryName: { type: String, required: true },

  tyreCompanyName: {
    type: String,
    required: true,
  },
  tyreCompanyDescription: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: () => {
      // Get current date in IST
      const ISTOffset = 330; // IST offset is UTC+5:30
      const now = new Date();
      const offsetMs = now.getTimezoneOffset() * 60 * 1000; // Offset in milliseconds
      const istTime = new Date(now.getTime() + (ISTOffset + offsetMs));
      return istTime;
    },
  },
});

// Create the  model using the schema
const Brand = mongoose.model("", brandSchema);

// Export the Category model
module.exports = Brand;
