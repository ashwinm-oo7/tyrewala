// models/Subcategory.js
const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  subCategoryName: { type: String, required: true },
  subCategoryDescription: { type: String },
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
  // Define other subcategory fields as needed
});

const Subcategory = mongoose.model("", subcategorySchema);

module.exports = Subcategory;
