const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  caption: { type: String },
  fileName: { type: String },
  type: { type: String },
  filePath: { type: String },
  size: { type: String },
  dataURL: { type: String },
  description: { type: String },
  status: { type: Number },
  createdDate: { type: Date, default: Date.now },
  lastModifiedDate: { type: Date, default: Date.now },
});

const ProductImage = mongoose.model("", productImageSchema);

module.exports = ProductImage;
