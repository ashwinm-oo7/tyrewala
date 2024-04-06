const express = require("express");
const router = express.Router();
const Brand = require("../UserEntity/BrandEntity");

const db = require("../../../db"); // Import the MongoDB database connection module

router.post("/add", async (req, res) => {
  // console.log("BRANSSS : ");

  try {
    const {
      categoryName,
      subCategoryName,
      tyreCompanyName,
      tyreCompanyDescription,
    } = req.body;

    const newBrand = new Brand({
      categoryName: categoryName,
      subCategoryName: subCategoryName,
      tyreCompanyName: tyreCompanyName, // Map tyreCompanyName to name field in Category schema
      tyreCompanyDescription: tyreCompanyDescription,
    });

    // console.log("BRANDADD : ", newBrand);
    const dbInstance = await db.connectDatabase();
    const dbConnection = await dbInstance.getDb();
    const brandCollection = dbConnection.collection("brand");
    const savedBrand = await brandCollection.insertOne(newBrand);
    // console.log("CATEGORYs : ", savedBrand);

    res
      .status(201)
      .json({ message: "Category added successfully", brand: newBrand });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Failed to add category" });
  }
});

router.get(
  "/getTyreCompanyBySubcategoryName/:categoryName/:subCategoryName",
  async (req, res) => {
    try {
      const { categoryName, subCategoryName } = req.params;
      // console.log("SUBCATEGORY443433", subCategoryName);

      // console.log("categoryName", categoryName);

      const dbInstance = await db.connectDatabase();
      const dbConnection = await dbInstance.getDb();
      const productCollection = dbConnection.collection("brand");

      // Query all SUBcategories from the database
      const tyreBrand = await productCollection
        .find({ subCategoryName: subCategoryName, categoryName: categoryName })
        .toArray();
      // console.log("BRAND", tyreBrand);

      const tyreCompanyNames = tyreBrand.map(
        (tyrebrand) => tyrebrand.tyreCompanyName
      );
      // console.log("BRAND_NAME:", tyreCompanyNames);

      // Send the retrieved categories as JSON response
      res.status(200).json(tyreBrand);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  }
);
module.exports = router;
