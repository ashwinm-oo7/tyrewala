// Import necessary modules
const express = require("express");
const router = express.Router();
const db = require("../../../db"); // Import MongoDB's native driver

const ObjectId = require("mongodb").ObjectId;
const mongoose = require("mongoose");
const Constant = require("./Constant.js"); // Import the Constant module

const punctureRepairSchema = new mongoose.Schema({
  location: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  vehiclePlateNo: { type: String, required: true },
});
const PunctureRepair = mongoose.model("punctureRepair", punctureRepairSchema);

// GET endpoint to fetch all puncture repair records
router.get("/getPunctureRepairList", async (req, res) => {
  try {
    const { puncture } = req.params;

    const dbInstance = await db.connectDatabase();

    const dbConnection = await dbInstance.getDb();
    const punctureCollection = dbConnection.collection("punctureRepair");

    const punctureList = await punctureCollection.find({ puncture }).toArray();

    res.status(200).json(punctureList);
  } catch (error) {
    console.error("Error fetching puncture repairs:", error);
    res.status(500).json({ message: "Failed to fetch puncture repairs" });
  }
});

router.get("/getAllStatusStr", async (req, res) => {
  try {
    // Retrieve all status strings from the Constant module
    const statusStr = Constant.getAllStatusStr();
    // Send the status strings as a response
    res.status(200).json(statusStr);
  } catch (error) {
    console.error("Error fetching status strings:", error);
    res.status(500).json({ message: "Failed to fetch status strings" });
  }
});

router.get("/getPunctureRepairByMobileList/:mobile", async (req, res) => {
  try {
    const { mobile } = req.params;
    const dbInstance = await db.connectDatabase();

    const dbConnection = await dbInstance.getDb();
    const punctureCollection = dbConnection.collection("punctureRepair");
    const punctureRepairs = await punctureCollection
      .find({ mobileNumber: mobile })
      .toArray();

    // console.log(punctureRepairs, "punctureRepairs ");
    res.status(200).json(punctureRepairs);
  } catch (error) {
    console.error("Error fetching puncture repairs by mobile:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch puncture repairs by mobile" });
  }
});

router.put("/updateRepairStatus/:id/:status", async (req, res) => {
  try {
    const { id, status } = req.params;
    // Get the status constant value based on the status parameter received in the request params

    // console.log(id, "IDS", status, "STATUS");

    const dbInstance = await db.connectDatabase();
    const dbConnection = await dbInstance.getDb();
    const punctureCollection = dbConnection.collection("punctureRepair");

    // Find and update the puncture repair document by its ID
    const updatedRepair = await punctureCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnOriginal: false } // Return the updated document
    );

    // Check if the repair was found and updated
    if (updatedRepair) {
      res.status(200).json(updatedRepair);
    } else {
      res.status(404).json({ message: "Repair not found" });
    }
  } catch (error) {
    console.error("Error updating repair status:", error);
    res.status(500).json({ message: "Failed to update repair status" });
  }
});

router.post("/addPuncture", async (req, res) => {
  try {
    // Extract data from request body
    const { location, mobileNumber, vehiclePlateNo } = req.body;
    const createdAt = new Date(Date.now() + 330 * 60 * 1000);

    const newPunctureRepair = {
      location,
      mobileNumber,
      vehiclePlateNo,
      createdAt, // Set createdAt to the current date
    };

    const dbInstance = await db.connectDatabase();

    const dbConnection = await dbInstance.getDb();
    const customerCollection = dbConnection.collection("punctureRepair");
    const savedPuncture = await customerCollection.insertOne(newPunctureRepair);

    // console.log(savedPuncture, "savePuncturess ");
    res.status(201).json(savedPuncture);
  } catch (error) {
    // Handle errors
    console.error("Error adding puncture repair:", error);
    res.status(500).json({ message: "Failed to add puncture repair" });
  }
});

// PUT endpoint to update puncture repair total amount by ID
router.put("/updateAmout/:id/:amt", async (req, res) => {
  // console.log(req.params);
  try {
    const { id, amt } = req.params;
    const amount = parseInt(amt);
    const updateObject = {
      totalAmount: amount,
      update_at: new Date(Date.now() + 330 * 60 * 1000),
    };

    // delete updateObject._id;

    // console.log(id, "IDS", amount, "UPDATE", updateObject);

    const objectId = new ObjectId(id);

    const dbInstance = await db.connectDatabase();
    const dbConnection = await dbInstance.getDb();
    const punctureCollection = dbConnection.collection("punctureRepair");

    // Find and update the puncture repair document by its ID
    const updatedRepair = await punctureCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateObject }
    );

    // Check if the repair was found and updated

    res.status(200).json(updatedRepair);
  } catch (error) {
    console.error("Error updating repair total amount:", error);
    res.status(500).json({ message: "Failed to update repair total amount" });
  }
});

module.exports = router;
