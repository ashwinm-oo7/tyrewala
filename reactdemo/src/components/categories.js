import React, { Component } from "react";
// import "../css/categories.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaMinus,
  FaPlus,
  FaAngleRight,
  FaHome,
  FaArrowRight,
} from "react-icons/fa";

class Categories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // isOpen: false,
      categoryName: "",
      categoryDescription: "",
      // subcategories: [],
      // modalIsOpen: false,
    };

    this.handleCategoryNameChange = this.handleCategoryNameChange.bind(this);
    this.handleCategoryDescriptionChange =
      this.handleCategoryDescriptionChange.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
  }

  handleCategoryNameChange(event) {
    this.setState({ categoryName: event.target.value });
  }

  handleCategoryDescriptionChange(event) {
    this.setState({ categoryDescription: event.target.value });
  }

  handleCloseButtonClick() {
    this.setState({ modalIsOpen: false });
  }

  handleAddCategory = async (e) => {
    e.preventDefault();
    console.log(this.state);
    let data = {
      categoryName: this.state.categoryName,
      categoryDescription: this.state.categoryDescription,
    };
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "category/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        console.log(response);
        console.log("Add successfully");
        toast.success(" successfully added");
      } else {
        console.error("Failed to Add category");
      }
    } catch (error) {
      console.error("Error during user Category:", error);
    }
  };
  render() {
    const isCategoryNameEmpty = this.state.categoryName.trim() === "";

    return (
      <div className="categories-container">
        <div className="label-container">
          <label>
            Category Name<span style={{ color: "red" }}>*</span>:
            <input
              type="text"
              value={this.state.categoryName}
              onChange={this.handleCategoryNameChange}
              placeholder="Enter category name"
              className="input-field"
              required
            />
          </label>
        </div>
        <div className="label-container">
          <label>
            Category Description:
            <textarea
              value={this.state.categoryDescription}
              onChange={this.handleCategoryDescriptionChange}
              placeholder="Enter category name*"
              className="textarea-field"
            />
          </label>
        </div>
        <button
          onClick={this.handleAddCategory}
          disabled={isCategoryNameEmpty}
          className="submit-button"
        >
          Add
        </button>
        {/* <p className="next-subcategory" style={{ marginLeft: "440px" }}>
          <Link to="/subcategories">
            <FaArrowRight />
            Next
          </Link>
        </p> */}
        <p
          className="next-subcategory"
          style={{ marginLeft: "75px", padding: "50px" }}
        >
          <Link to="/home">
            <FaHome />
            Home
          </Link>
        </p>
      </div>
    );
  }
}

export default Categories;
