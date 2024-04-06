const express = require("express");
const router = express.Router();
const db = require("../../../db");

router.get("/getCarBrandModels", async (req, res) => {
  try {
    const dbInstance = await db.connectDatabase();
    const dbConnection = await dbInstance.getDb();
    const carBrandsData = await dbConnection.collection("car_brands");
    const carModelsData = await dbConnection.collection("car_models");
    const carBrands = await carBrandsData.find().toArray();
    const carModels = await carModelsData.find().toArray();
    // console.log("MOdels :: ", carModels);

    const dtos = [];

    // Iterate over each car model
    carModels.forEach((model) => {
      // Iterate over each data item in the model
      // console.log(model.data.length, "", model);

      model.data.forEach((modelData) => {
        // Find the corresponding brand in the car brands collection
        const brand = carBrands.find((brand) =>
          brand.data.some((data) => data.id === modelData.brand_id)
        );

        // If brand is found, construct DTO
        if (brand) {
          const dto = {
            id: modelData.id,
            name: `${
              brand.data.find((data) => data.id === modelData.brand_id).name
            } : ${modelData.name}`,
            categoryName: brand.categoryName, // Replace with actual category name
          };
          dtos.push(dto);
        }
      });
    });

    // Send the resulting DTOs as JSON response
    res.status(200).json(dtos);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

module.exports = router;
