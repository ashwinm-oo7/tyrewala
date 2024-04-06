// AddProduct.js
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "../css/ProductImage.css";
import { FaTimes, FaHome } from "react-icons/fa"; // Import pencil icon from react-icons library
import Multiselect from "multiselect-react-dropdown";

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryOptions: [],
      subCategoryOptions: [],
      selectedCategory: "",
      selectedSubCategory: "",
      tyreCompanyOptions: [],
      selectedBrand: "",
      productImages: [],
      productName: "",
      productPrice: 0,
      productMrpPrice: 0,
      discount: 0,
      productQuantity: 0,
      skuCode: "",
      manufacturer: "",
      productDescription: "",
      activeTab: "general", // Add state for active tab
      productIdToUpdate: null,
      defaultDisabled: false,
      options: [],
      categoryForDropdownSearch: "",
      disabled: false,
      vehicleBrandModels: [],
      tyreSize: "",
    };
    this.state.productIdToUpdate = "";
    const params = new URLSearchParams(window.location.search);
    this.state.productIdToUpdate = params.get("id");
    console.log("ID FROM URL : ", this.state.productIdToUpdate);
    if (this.state.productIdToUpdate) {
      this.fetchProductByProductId(this.state.productIdToUpdate);
    }
  }

  fetchProductByProductId = async (productIdToUpdate) => {
    const response = await fetch(
      process.env.REACT_APP_API_URL +
        `product/getProductById/${productIdToUpdate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const productData = await response.json();
    console.log("productData : ", productData);
    if (productData.categoryName === "Two Wheeler") {
      console.log(" calling consructoer two wheeler");
      await this.fetchMotoBrandModels(productData.categoryName);
    }
    if (productData.categoryName === "Four Wheeler") {
      await this.fetchCarBrandModels(productData.categoryName);
    }
    setTimeout(() => {
      this.setState({
        defaultDisabled: true,
        selectedCategory: productData.categoryName,
        selectedSubCategory: productData.subCategoryName,
        selectedBrand: productData.brandName,
        productName: productData.productName,
        productPrice: productData.productPrice,
        productMrpPrice: productData.productMrpPrice,
        discount: productData.discount,
        productQuantity: productData.productQuantity,
        skuCode: productData.skuCode,
        manufacturer: productData.manufacturer,
        productDescription: productData.productDescription,
        productImages: productData.productImages,
        selectedValue: productData.vehicleBrandModels,
        tyreSize: productData.tyreSize,
      });
      if (productData.categoryName) {
        this.fetchSubCategoryOptions(productData.categoryName);
      }
      if (productData.subCategoryName) {
        this.fetchTyreCompanyOptions(
          productData.subCategoryName,
          productData.categoryName
        );
      }
    }, 100);
  };

  componentDidMount() {
    this.fetchCategoryOptions();
  }

  fetchCategoryOptions = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "category/allCategory"
      );
      console.log("Category Response:", response);
      const categoryOptions = response.data.map(
        (category) => category.categoryName
      );

      console.log("Category Options:", categoryOptions);
      this.setState({ categoryOptions });
    } catch (error) {
      console.error("Error fetching category options:", error);
    }
  };

  fetchSubCategoryOptions = async (selectedCategory) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          `subcategory/getSubcategoriesByCategoryName/${selectedCategory}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const subcategoryData = await response.json();
      console.log("SubCategory Response:", subcategoryData);

      const subCategoryOptions = subcategoryData.map(
        (subcategory) => subcategory.subCategoryName
      );
      console.log("SubCategory Options:", subCategoryOptions);

      this.setState({ subCategoryOptions });
    } catch (error) {
      console.error("Error fetching subcategory options:", error);
    }
  };

  fetchMotoBrandModels = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "motoBrandModels/getMotoBrandModels"
      );
      const brandModels = await response;
      console.log("MOTO brandModels Response:", brandModels.data);
      this.setState({ options: brandModels.data });
      this.setState({
        categoryForDropdownSearch: brandModels.data[0].categoryName,
      });
      console.log(
        "MOTO categoryForDropdownSearch:",
        brandModels.data[0].categoryName
      );
    } catch (error) {
      console.error("Error fetching category options:", error);
    }
  };

  fetchCarBrandModels = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "carBrandModels/getCarBrandModels"
      );
      const brandModels = await response;
      console.log("car brandModels Response:", brandModels.data);
      this.setState({ options: brandModels.data });
      this.setState({
        categoryForDropdownSearch: brandModels.data[0].categoryName,
      });
      console.log(
        "CAR categoryForDropdownSearch:",
        brandModels.data[0].categoryName
      );
    } catch (error) {
      console.error("Error fetching category options:", error);
    }
  };

  handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === "Two Wheeler") {
      await this.fetchMotoBrandModels(selectedCategory);
    }
    if (selectedCategory === "Four Wheeler") {
      await this.fetchCarBrandModels(selectedCategory);
    }

    setTimeout(() => {
      console.log("Category Selected:", selectedCategory);
      console.log("Category drop : ", this.state.categoryForDropdownSearch);
      if (selectedCategory !== this.state.categoryForDropdownSearch) {
        this.setState({ options: [] });
      }
    }, 100);

    await this.setState({ selectedCategory });

    this.fetchSubCategoryOptions(selectedCategory);
  };
  // *************************GET TYRE Company*********************************************************************
  fetchTyreCompanyOptions = async (selectedSubCategory, selectedCategory) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          `brand/getTyreCompanyBySubcategoryName/${selectedCategory}/${selectedSubCategory}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const tyreCompanyData = await response.json();
      console.log("tyreCom Response:", tyreCompanyData);

      const tyreCompanyOptions = tyreCompanyData.map(
        (tyreCompanydata) => tyreCompanydata.tyreCompanyName
      );
      console.log("tyreCompanyName Options:", tyreCompanyOptions);

      this.setState({ tyreCompanyOptions });
    } catch (error) {
      console.error("Error fetching subcategory options:", error);
    }
  };

  handleSubCategoryChange = async (e) => {
    const selectedSubCategory = e.target.value;

    await this.setState({ selectedSubCategory });

    this.fetchTyreCompanyOptions(
      selectedSubCategory,
      this.state.selectedCategory
    );
    // Pass the selected Subcategory to fetch subcategories
  };

  // ********************************************************************************************
  uploadBase64Image = (base64String, filename) => {
    const element = document.createElement("a");
    element.setAttribute("href", base64String);
    element.setAttribute("upload", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  uploadAllImages = () => {
    // Iterate through all images and upload them
    this.state.images.forEach((image, index) => {
      this.uploadBase64Image(image.dataURL, `Image_${index + 1}.png`);
    });
  };

  handleAddProduct = async () => {
    const {
      selectedCategory,
      selectedSubCategory,
      selectedBrand,
      productName,
      productPrice,
      productMrpPrice,
      discount,
      productQuantity,
      skuCode,
      manufacturer,
      productDescription,
      productImages,
      productIdToUpdate,
    } = this.state;
    try {
      const discountPercentage = await this.calculateDiscountPercentage(
        productMrpPrice,
        productPrice
      );
      console.log("discount ", discountPercentage);
      if (
        !this.state.selectedCategory ||
        this.state.selectedCategory.length === 0
      ) {
        console.log("category", this.state.categoryName);
        toast.warning("Please select Categoty !");
        return;
      }
      if (
        !this.state.selectedSubCategory ||
        this.state.selectedSubCategory.length === 0
      ) {
        toast.warning("Please select SubCategoty !");
        return;
      }
      if (!this.state.selectedBrand || this.state.selectedBrand.length === 0) {
        toast.warning("Please select Brand !");
        return;
      }
      if (!productImages || productImages.length === 0) {
        toast.warning("Please upload product images");
        return;
      }

      // const response = await axios.post(
      //   process.env.REACT_APP_API_URL + "product/add",
      const productData = {
        categoryName: selectedCategory,
        subCategoryName: selectedSubCategory,
        brandName: selectedBrand,
        productName: productName,
        productPrice: productPrice,
        productMrpPrice: productMrpPrice,
        discount: discountPercentage,
        productQuantity: productQuantity,
        skuCode: skuCode,
        manufacturer: manufacturer,
        productDescription: productDescription,
        productImages: this.state.productImages,
        vehicleBrandModels: this.state.vehicleBrandModels,
        tyreSize: this.state.tyreSize,
      };

      let response;

      // Check if productIdToUpdate is present, if yes, update the product, else, add a new product
      if (productIdToUpdate) {
        console.log("productData : ", productData);
        response = await axios.put(
          process.env.REACT_APP_API_URL + `product/update/${productIdToUpdate}`,
          productData
        );
      } else {
        response = await axios.post(
          process.env.REACT_APP_API_URL + "product/add",
          productData
        );
      }

      if (response.status === 201) {
        this.setState({
          selectedCategory: "",
          selectedSubCategory: "",
          selectedBrand: "",
          productName: "",
          brandName: "",
          productPrice: 0,
          productMrpPrice: 0,
          discount: 0,
          productQuantity: 0,
          skuCode: "",
          manufacturer: "",
          productDescription: "",
          productImages: [],
        });
        toast.success("Product added successfully", { autoClose: 2000 });
        console.log(response.status);
      } else if (response.status === 200) {
        toast.success("Product updated successfully", { autoClose: 2000 });
        console.log(response.status);
      } else {
        toast.error("Failed to add product");
        console.log(response.status);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product");
    }
    window.location.reload();
  };

  handleTabChange = (tabName) => {
    this.setState({ activeTab: tabName });
  };

  calculateDiscountPercentage = async (mrp, price) => {
    return ((mrp - price) / mrp) * 100;
  };

  handleImageUpload = async (e, images) => {
    const files = e.target.files;
    const updatedImages = [...this.state.productImages];
    const reader = new FileReader();

    if (files.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    if (this.state.productImages.length + files.length > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size <= 5 * 1024 * 1024) {
        try {
          const base64String = await fileToBase64(file);
          updatedImages.push({
            dataURL: base64String,
            fileName: file.name,
            type: file.type,
            size: Math.round(file.size / 1024),
            description: "Description for image " + (i + 1),
            productId: "",
          });
          console.log("state after image selected : ", this.state);
        } catch (error) {
          console.error("Error converting file to base64:", error);
          return;
        }
      } else {
        alert("Image size exceeds 5MB limit");
        return;
      }
      reader.readAsDataURL(file);
    }

    // Update state with uploaded image
    this.setState({
      productImages: updatedImages,
      imageIndex: null, // Reset the image index when new images are uploaded
    });
  };

  handleDeleteImage = (index) => {
    // Make a copy of the productImages array
    const updatedImages = [...this.state.productImages];
    // Remove the image at the specified index
    updatedImages.splice(index, 1);
    // Update the state with the modified array
    this.setState({ productImages: updatedImages });
  };
  onSelect = (selectedList, selectedItem) => {
    console.log(selectedList);
    this.setState({ vehicleBrandModels: selectedList });
  };

  onRemove(selectedList, removedItem) {
    // this.setState({ vehicleBrandModels: selectedList});
    console.log("remove : ", selectedList);
  }

  render() {
    const isProductNameEmpty = this.state.productName.trim() === "";

    return (
      <div className="add-product-container">
        <div className="tab-buttons">
          <div className="tab-content">
            <div>
              <label>
                Category
                :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <select
                  id="categorySelectId"
                  value={this.state.selectedCategory}
                  onChange={this.handleCategoryChange}
                  disabled={this.state.defaultDisabled ? true : null}
                >
                  <option value="">Select a category</option>
                  {this.state.categoryOptions.map((categoryName) => (
                    <option key={categoryName} value={categoryName}>
                      {categoryName}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                SubCategory:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <select
                  id="subCategorySelectId"
                  value={this.state.selectedSubCategory}
                  onChange={this.handleSubCategoryChange}
                  disabled={this.state.defaultDisabled ? true : null}
                >
                  <option value="">Select a subcategory</option>
                  {this.state.subCategoryOptions.map((subcategoryName) => (
                    <option key={subcategoryName} value={subcategoryName}>
                      {subcategoryName}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Tyre Company :&nbsp;
                <select
                  id="brandSelectId"
                  value={this.state.selectedBrand}
                  disabled={this.state.defaultDisabled ? true : null}
                  onChange={(e) =>
                    this.setState({ selectedBrand: e.target.value })
                  }
                >
                  <option value="">Select a Brand</option>
                  {this.state.tyreCompanyOptions.map((tyreCompanyName) => (
                    <option key={tyreCompanyName} value={tyreCompanyName}>
                      {tyreCompanyName}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Product Name<span style={{ color: "red" }}>*</span>:
                <input
                  type="text"
                  value={this.state.productName}
                  onChange={(e) =>
                    this.setState({ productName: e.target.value })
                  }
                  placeholder="Enter Product Name"
                  required
                />
              </label>
              <label>
                Tyre Size<span style={{ color: "red" }}>*</span>:
                <input
                  type="text"
                  value={this.state.tyreSize}
                  onChange={(e) => this.setState({ tyreSize: e.target.value })}
                  placeholder="Enter Tyre Size"
                  required
                />
              </label>
              <label>
                Vehicles :
                <Multiselect
                  options={this.state.options}
                  selectedValues={this.state.selectedValue}
                  onSelect={this.onSelect}
                  onRemove={this.onRemove}
                  displayValue="name"
                  disable={this.state.disabled}
                  selectionLimit={10}
                />
              </label>
              <label>
                Product Price<span style={{ color: "red" }}>*</span>:
                <input
                  type="number"
                  value={this.state.productPrice}
                  onChange={(e) =>
                    this.setState({ productPrice: e.target.value })
                  }
                  placeholder="Enter product price"
                  required
                />
              </label>
              <label>
                MRP Price<span style={{ color: "red" }}>*</span>:
                <input
                  type="number"
                  value={this.state.productMrpPrice}
                  onChange={(e) =>
                    this.setState({ productMrpPrice: e.target.value })
                  }
                  placeholder="Enter MRP price"
                  required
                />
              </label>
              <label>
                Product Qty<span style={{ color: "red" }}>*</span>:
                <input
                  type="number"
                  value={this.state.productQuantity}
                  onChange={(e) =>
                    this.setState({ productQuantity: e.target.value })
                  }
                  placeholder="Enter product quantity"
                  required
                />
              </label>
              <label>
                SKU Code<span style={{ color: "red" }}>*</span>:
                <input
                  type="text"
                  value={this.state.skuCode}
                  onChange={(e) => this.setState({ skuCode: e.target.value })}
                  placeholder="Enter product quantity"
                  required
                />
              </label>
              <label>
                Manufacturer<span style={{ color: "red" }}>*</span>:
                <input
                  type="text"
                  value={this.state.manufacturer}
                  onChange={(e) =>
                    this.setState({ manufacturer: e.target.value })
                  }
                  placeholder="Enter product quantity"
                  required
                />
              </label>

              <label>
                Product Description:
                <textarea
                  value={this.state.productDescription}
                  onChange={(e) =>
                    this.setState({ productDescription: e.target.value })
                  }
                  placeholder="Enter product description"
                />
              </label>
              <label>
                <div>
                  {/* Input field for image upload */}
                  <div>
                    Upload Images:
                    <input
                      type="file"
                      multiple
                      onChangeCapture={this.handleImageUpload}
                    />
                  </div>
                  {/* Display uploaded images */}
                  <div className="image-preview">
                    {this.state.productImages.map((image, index) => (
                      <div className="image-preview-item" key={index}>
                        <img
                          src={image.dataURL}
                          alt={`Product Imagee ${index + 1}`}
                        />

                        <p>Names: {image.fileName}</p>

                        <p>Description: {image.description}</p>

                        <p>Size: {image.size} KB</p>

                        {/* <p > Type: {image.type}</p> */}

                        <FaTimes
                          className="delete-icon"
                          onClick={() => this.handleDeleteImage(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </label>

              <button
                style={{ fontSize: "16px", width: "90%" }}
                onClick={this.handleAddProduct}
                disabled={isProductNameEmpty}
                className="ADD_Product"
              >
                {this.state.productIdToUpdate ? "Update" : "Add Product"}
              </button>

              <p
                className="next-subcategory"
                style={{ marginLeft: "100 px", padding: "50px" }}
              >
                <Link to="/home">
                  <FaHome />
                  Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddProduct;
