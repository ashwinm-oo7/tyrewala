const mongoose = require("mongoose");

// Define the schema for the  model
const productSchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  subCategoryName: { type: String, required: true },
  brandName: { type: String, required: true },
  tyreCompanyDescription: { type: String },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productMrpPrice: { type: Number, required: true },
  discount: { type: Number },
  productQuantity: { type: Number, required: true },
  skuCode: { type: String, required: true },
  manufacturer: { type: String, required: true },
  productDescription: { type: String, required: true },
  tyreSize: { type: String, required: true },
  specifications: { type: String },
  createdDate: { type: Date, default: Date.now },
  lastModifiedDate: { type: Date, default: Date.now },
  // productImages: [{ type: Object }],
  vehicleBrandModels: [{ type: Object }],

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
const Product = mongoose.model("", productSchema);

// Export the Category model
module.exports = Product;
