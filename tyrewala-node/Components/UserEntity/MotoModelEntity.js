// MotoModelModel.js

const mongoose = require("mongoose");

const motoModelSchema = new mongoose.Schema({
  // Define your schema fields here

  data: [
    {
      brand_id: { type: Number },
      id: { type: Number },
      name: { type: String },
    },
  ],

  // Other fields...
});

const MotoModel = mongoose.model("", motoModelSchema);
mongoose.connect(
  "mongodb+srv://ashwinmaurya1997:PASSWORD@cluster0.d7wnxkj.mongodb.net/tyrecentre?retryWrites=true&w=majority",
  {}
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = MotoModel;
