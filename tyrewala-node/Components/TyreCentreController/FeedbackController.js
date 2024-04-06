const express = require("express");
const router = express.Router();
const Category = require("../UserEntity/CategoryEntity");
const db = require("../../../db");
const { ObjectId } = require("mongodb");

// Route to get all categories

router.get("/getAllFeedback", async (req, res) => {
  try {
    // Access the MongoDB database instance
    const categoryys = req.body;

    const dbInstance = await db.connectDatabase();
    const dbConnection = await dbInstance.getDb();
    const categoryCollection = dbConnection.collection("feedback");

    const categories = await categoryCollection.find().toArray();

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// Route to delete a category by ID
router.delete("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
});

module.exports = router;
