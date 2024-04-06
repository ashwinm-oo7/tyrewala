// valueObjectDTO.js

const mongoose = require("mongoose");

const valueObjectSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  brand_id: { type: Number, required: true },
  name: { type: String, required: true },
  categoryName: { type: String },
});

const ValueObjectDTO = mongoose.model("ValueObjectDTO", valueObjectSchema);

module.exports = ValueObjectDTO;
