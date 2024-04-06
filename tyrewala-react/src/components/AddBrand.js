// AddProduct.js
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "../css/AddBrand.css";
import Subcategories from "./subcategories";
import Categories from "./categories";
import AddProduct from "./AddProduct";
import { FaHome } from "react-icons/fa";

class AddBrand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryOptions: [],
      subCategoryOptions: [],
      selectedCategory: [],
      selectedSubCategory: [],
      productName: "",
      productDescription: "",
      activeTab: "Categories", // Add state for active tab
    };
  }

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
      this.setState({ categoryOptions: categoryOptions });
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

      this.setState({ subCategoryOptions: subCategoryOptions });
    } catch (error) {
      console.error("Error fetching subcategory options:", error);
    }
  };

  handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;

    await this.setState({ selectedCategory });

    this.fetchSubCategoryOptions(selectedCategory);
    // Pass the selected category to fetch subcategories
  };

  handleAddProduct = async () => {
    const {
      selectedCategory,
      selectedSubCategory,
      productName,
      productDescription,
    } = this.state;
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "brand/add",
        {
          categoryName: selectedCategory,
          subCategoryName: selectedSubCategory,
          tyreCompanyName: productName,
          tyreCompanyDescription: productDescription,
        }
      );
      this.setState({
        selectedCategory: "",
        selectedSubCategory: "",
        productName: "",
        productDescription: "",
      });
      console.log(response);
      if (response.status === 201) {
        toast.success("Product Added successfully");
      } else {
        if (response.status === 406) {
          toast.warning("Duplicate Data");
        } else {
          console.log(response);

          toast.error("Failed to Add category");
        }
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product");
    }
  };
  handleTabChange = (tabName) => {
    console.log(tabName);
    this.setState({ activeTab: tabName });
  };

  render() {
    const isProductNameEmpty = this.state.productName.trim() === "";

    return (
      <div className="add-product-container">
        <div className="tab-buttons">
          <button
            className={this.state.activeTab === "Categories" ? "active" : ""}
            onClick={() => this.handleTabChange("Categories")}
          >
            ADD CATEGORY
          </button>
          <button
            className={this.state.activeTab === "SUBCATEGORY" ? "active" : ""}
            onClick={() => this.handleTabChange("SUBCATEGORY")}
          >
            ADD SUBCATEGORY
          </button>
          <button
            className={this.state.activeTab === "ADD-BRAND" ? "active" : ""}
            onClick={() => this.handleTabChange("ADD-BRAND")}
          >
            {" "}
            ADD BRAND{" "}
          </button>
          <button
            className={this.state.activeTab === "ADD-PRODUCT" ? "active" : ""}
            onClick={() => this.handleTabChange("ADD-PRODUCT")}
          >
            {" "}
            ADD PRODUCT{" "}
          </button>
        </div>
        {this.state.activeTab === "ADD-PRODUCT" && (
          <div>
            <AddProduct />
          </div>
        )}
        <div className="tab-content">
          {this.state.activeTab === "Categories" && (
            <div>
              <Categories />
            </div>
          )}

          {this.state.activeTab === "SUBCATEGORY" && (
            <div>
              <Subcategories />
            </div>
          )}

          {this.state.activeTab === "ADD-BRAND" && (
            <div>
              <label>
                Category :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <select
                  value={this.state.selectedCategory}
                  onChange={this.handleCategoryChange}
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
                Subcategory :&nbsp;&nbsp;
                <select
                  value={this.state.selectedSubCategory}
                  onChange={(e) =>
                    this.setState({ selectedSubCategory: e.target.value })
                  }
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
                Product Tyre Brand<span style={{ color: "red" }}>*</span>:
                <input
                  type="text"
                  value={this.state.productName}
                  onChange={(e) =>
                    this.setState({ productName: e.target.value })
                  }
                  placeholder="Enter Product Brand"
                  required
                />
              </label>

              <label>
                Tyre Product Description:
                <textarea
                  value={this.state.productDescription}
                  onChange={(e) =>
                    this.setState({ productDescription: e.target.value })
                  }
                  placeholder="Enter product description"
                />
              </label>

              <button
                onClick={this.handleAddProduct}
                disabled={isProductNameEmpty}
              >
                Add Product
              </button>

              <p
                className="next-subcategory"
                style={{ marginLeft: "85px", padding: "50px" }}
              >
                <Link to="/home">
                  <FaHome />
                  Home
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AddBrand;
