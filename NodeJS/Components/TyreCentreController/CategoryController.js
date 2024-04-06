const express = require("express");
const router = express.Router();
const Category = require("../UserEntity/CategoryEntity");
const db = require("../../../db");
const { ObjectId } = require("mongodb");

router.post("/add", async (req, res) => {
  // console.log("CATEGORYs : ");

  try {
    const { categoryName, categoryDescription } = req.body;
    const newCategory = new Category({
      categoryName: categoryName, // Map categoryName to name field in Category schema
      categoryDescription: categoryDescription, // Map description to description field in Category schema
    });

    // console.log("CATEGORYssss : ", newCategory);
    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const categoryCollection = db1.collection("category");
    const savedCategory = await categoryCollection.insertOne(newCategory);

    // console.log("CATEGORYs : ", savedCategory);

    res
      .status(201)
      .json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Failed to add category" });
  }
});

// Route to get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

router.get("/allCategory", async (req, res) => {
  try {
    // Access the MongoDB database instance
    const categoryys = req.body;

    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();
    const categoryCollection = db1.collection("category");

    const categories = await categoryCollection.find().toArray();

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// Route to get a single category by ID
router.get("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Failed to fetch category" });
  }
});

// Route to update a category by ID
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    delete updatedData._id;

    // console.log(id, "UPDATED", updatedData);

    const dbInstance = await db.connectDatabase();
    const db1 = await dbInstance.getDb();

    // Get the collection where subcategories or categories are stored based on the route
    const collection = db1.collection("category");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    // console.log("RESULT selected", result);

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Category updated successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Failed to update document" });
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
