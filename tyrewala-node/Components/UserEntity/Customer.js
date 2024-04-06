const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: String,
  age: Number,
  gender: String,
  update_at: { type: Date, default: Date.now },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const Customer = mongoose.model("customer", customerSchema, "customer");

mongoose.connect(
  "mongodb+srv://ashwinmaurya1997:Ruparelcolg%402045@cluster0.d7wnxkj.mongodb.net/tyrecentre?retryWrites=true&w=majority",
  {}
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = Customer;
