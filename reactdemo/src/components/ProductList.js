import React, { Component } from "react";
import axios from "axios";
import "../css/ProductList.css";
import { FaPencilAlt, FaTrash } from "react-icons/fa"; // Import pencil icon from react-icons library
import { Link } from "react-router-dom";
import EditProductModal from "./EditProductModal.js";
// Import the popup/modal component

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      selectedProduct: null,
      isEditModalOpen: false,
    };
    this.fetchAllProducts();
  }

  fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "product/getAllProducts"
      );
      console.log("fetchAllProducts Response:", response.data);
      this.setState({ products: response.data });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  handleEdit = (product) => {
    this.setState({ selectedProduct: product, isEditModalOpen: true });
    console.log(product);
  };
  handleModalClose = () => {
    this.setState({ isEditModalOpen: false });
  };

  handleSaveChanges = (updatedProduct) => {
    const { products } = this.state;
    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    this.setState({ products: updatedProducts, isEditModalOpen: false });
  };

  handleUpdate = async () => {
    const { products, selectedProduct, isEditModalOpen } = this.state;
    try {
      await axios.put(
        process.env.REACT_APP_API_URL +
          `product/updateProduct/${selectedProduct._id}`,
        selectedProduct
      );
      this.setState({ editedProduct: null });
      console.log("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  render() {
    const { editedProduct, isModalOpen } = this.state;
    // In ProductList.js
    const { selectedProduct, isEditModalOpen, products } = this.state;

    return (
      <div className="product-list">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Category</th>
              <th>SubCategory</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Manufacturer</th>
              <th>Description</th>
              <th>Edit</th>

              {/* Add more headers as needed */}
            </tr>
          </thead>
          <tbody>
            {this.state.products.map((product, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={product.productImages[0].dataURL}
                    alt={product.productName}
                  />
                </td>
                <td>{product.categoryName}</td>
                <td>{product.subCategoryName}</td>
                <td>{product.brandName}</td>
                <td>{product.productPrice}</td>
                <td>{product.productQuantity}</td>
                <td>{product.manufacturer}</td>
                <td>{product.productDescription}</td>
                <td>
                  {/* <a href={`/add-product?id=${product.id}`}> */}
                  {/* <i class="fa fa-pencil"></i> */}
                  <Link to={`/add-product?id=${product._id}&id=${product._id}`}>
                    <FaPencilAlt onClick={() => this.handleEdit(product)} />
                  </Link>
                  {/* </a> */}
                </td>

                {/* Add more cells for additional details */}
              </tr>
            ))}
          </tbody>
        </table>
        {/* {isEditModalOpen && (
          <EditProductModal
            product={selectedProduct}
            onSave={this.handleSaveChanges}
            onClose={this.handleModalClose}
          />
        )} */}
      </div>
    );
  }
}
export default ProductList;
