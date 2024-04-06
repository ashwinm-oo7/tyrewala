const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./Components/TyreCentreController/UserController.js");
const categoryRoutes = require("./Components/TyreCentreController/CategoryController.js");
const subCategoryRoutes = require("./Components/TyreCentreController/SubCategoryController.js");
const brandRoutes = require("./Components/TyreCentreController/BrandController.js");
const productRoutes = require("./Components/TyreCentreController/ProductController.js");
const carBrandRoutes = require("./Components/TyreCentreController/CarBrandController.js");
const motoBrandRoutes = require("./Components/TyreCentreController/MotoBrandController.js");
const punctureRepairRoutes = require("./Components/TyreCentreController/PunctureRepairController.js");
const feedBackRoutes = require("./Components/TyreCentreController/FeedbackController.js");

const bodyParser = require("body-parser");

// Load environment variables from .env file

dotenv.config();

// Create Express application
const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// Parse JSON request bodies
app.use(bodyParser.json());
// Middleware
app.use(cors()); // Enable CORS for all routes
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/subcategory", subCategoryRoutes);
app.use("/product", productRoutes);
app.use("/brand", brandRoutes);
app.use("/carBrandModels", carBrandRoutes);
app.use("/motoBrandModels", motoBrandRoutes);
app.use("/punctureRepair", punctureRepairRoutes);
app.use("/feedback", feedBackRoutes);

// Start the server
const PORT = process.env.BACKEND_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
