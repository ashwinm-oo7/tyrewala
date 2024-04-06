// MotoBrandModel.js
const mongoose = require("mongoose");

const motoBrandSchema = new mongoose.Schema({
  // Define your schema fields here

  data: [{ id: { type: Number }, name: { type: String } }],
  categoryName: { type: String },

  // Other fields...
});

const MotoBrand = mongoose.model("", motoBrandSchema);

mongoose.connect(
  "mongodb+srv://ashwinmaurya1997:PASSWORD@cluster0.d7wnxkj.mongodb.net/tyrecentre?retryWrites=true&w=majority",
  {}
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = MotoBrand;
