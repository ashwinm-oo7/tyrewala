const mongoose = require("mongoose");

// Define the schema for the Category model
const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  categoryDescription: {
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

// Create the Category model using the schema
const Category = mongoose.model("", categorySchema);

// Export the Category model
module.exports = Category;
