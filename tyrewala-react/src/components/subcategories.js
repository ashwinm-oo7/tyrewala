import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
class Subcategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryOptions: [],
      selectedCategory: "",
      subCategoryName: "",
      selectedSubCategory: "",
      subCategoryDescription: "",
      tyreCompanyName: "",
      tyreCompanyDescription: "",

      // Other state variables for subcategories
    };

    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleSubCategoryNameChange =
      this.handleSubCategoryNameChange.bind(this);
    this.handleSubCategoryDescriptionChange =
      this.handleSubCategoryDescriptionChange.bind(this);

    this.handleAddSubCategory = this.handleAddSubCategory.bind(this);
  }

  handleAddButtonClick() {
    this.setState({ isOpen: true });
  }
  handleSubCategoryNameChange(event) {
    this.setState({ subCategoryName: event.target.value });
  }

  handleSubCategoryDescriptionChange(event) {
    this.setState({ subCategoryDescription: event.target.value });
  }

  handleAddSubCategory = async (e) => {
    e.preventDefault();

    console.log(this.state);

    let data = {
      categoryName: this.state.selectedCategory,
      subCategoryName: this.state.subCategoryName,
      subCategoryDescription: this.state.subCategoryDescription,
    };
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "subcategory/add",
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
        toast.success("Add successfully");

        // Redirect or perform any other actions after successful registration
      } else {
        if (response.status === 406) {
          toast.warning("Duplicate Data");
        } else {
          toast.error("Failed to Add category");
        }
      }
    } catch (error) {
      toast.error("Error during user Category:", error);
    }
  };

  componentDidMount() {
    console.log("didmount");
    this.fetchCategoryOptions();
  }

  handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;

    await this.setState({ selectedCategory });

    // Reset subcategory and tyre category options when the category changes
    this.setState({
      selectedSubCategory: "",
      tyreCategoryOptions: [],
    });

    // Fetch subcategory options
    this.fetchSubCategoryOptions(selectedCategory);
  };

  handleSubCategoryChange = async (e) => {
    const selectedSubCategory = e.target.value;

    await this.setState({ selectedSubCategory });

    // Fetch tyre category options
    this.fetchTyreCategoryOptions(
      this.state.selectedCategory,
      selectedSubCategory
    );
  };

  fetchCategoryOptions = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "category/allCategory",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Category options:", data); // Log fetched category options

        const categoryNames = data.map((category) => category.categoryName);

        this.setState({ categoryOptions: categoryNames });
      } else {
        console.error("Failed to fetch category options");
      }
    } catch (error) {
      console.error("Error fetching category options:", error);
    }
  };

  render() {
    const isSubCategoryNameEmpty = this.state.subCategoryName.trim() === "";

    return (
      <div>
        <label>
          Category:
          <select
            value={this.state.selectedCategory}
            onChange={(e) =>
              this.setState({ selectedCategory: e.target.value })
            }
          >
            <option value="">Select a category</option>
            {this.state.categoryOptions.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
        </label>
        {/* Render other subcategory fields here */}
        {/* 888888888888888888888888888888888888888888888888888888888888 */}

        <br />
        <div style={{ backgroundColor: "", padding: "10px" }}>
          <label>
            SubCategory Name<span style={{ color: "red" }}>*</span>:
            <input
              type="text"
              value={this.state.subCategoryName}
              onChange={this.handleSubCategoryNameChange}
              placeholder="Enter subcategory name"
              required
            />
          </label>
          <div>
            <label>
              SubCategory Description:
              <textarea
                value={this.state.subCategoryDescription}
                onChange={this.handleSubCategoryDescriptionChange}
                placeholder="Enter subcategory Description*"
              />
            </label>
          </div>
          <button
            onClick={this.handleAddSubCategory}
            disabled={isSubCategoryNameEmpty}
            style={{
              marginRight: "0.5cm",
              backgroundColor: "",
              color: "white",
            }}
          >
            Add
          </button>

          {/* <button
            onClick={this.handleCloseButtonClick}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Close
          </button> */}

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
      </div>
    );
  }
}

export default Subcategories;
