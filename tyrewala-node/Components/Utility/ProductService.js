const Product = require("../TyreCentreController/ProductController");
const ProductImages = require("../UserEntity/ProductImage");
const FileUtility = require("./FileUtility");

class ProductService {
  async addOrUpdateTyreCompany(entity) {
    try {
      if (entity) {
        // Save or update product images
        for (const image of entity.productImages) {
          const filePath = await FileUtility.saveBase64FileByName(
            image.dataURL,
            FileUtility.fileDir,
            image.fileName.split(".")[0],
            image.fileName.split(".")[1]
          );
          image.filePath = filePath;
          image.dataURL = null;
        }
      }
      const product = await Product.create(entity);
      return product;
    } catch (error) {
      console.error("Error adding or updating product:", error);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      let productList = await Product.find();
      // Retrieve base64 image data for each product image
      for (const product of productList) {
        for (const image of product.productImages) {
          image.dataURL = await FileUtility.getBase64Image(image.filePath);
        }
      }
      return productList;
    } catch (error) {
      console.error("Error getting all products:", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      if (product) {
        // Retrieve base64 image data for each product image
        for (const image of product.productImages) {
          image.dataURL = await FileUtility.getBase64Image(image.filePath);
        }
        return product;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting product by ID:", error);
      throw error;
    }
  }
}

module.exports = ProductService;
