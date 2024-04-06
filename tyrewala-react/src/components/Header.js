import React, { Component, useState } from "react";
import {
  FaBicycle,
  FaCar,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaUserShield,
  FaInfoCircle,
} from "react-icons/fa";
import axios from "axios";
import "../css/home.css";
import { Link } from "react-router-dom";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      products: [],
      carBrands: [],
      bikeBrands: [],
      cart: [],
      selectedProduct: null,
      searchData: [],
      searchQuery: "",
      searchHistory: [],
      isInputFocused: false,
      searchResults: [],
      isFormVisible: false,
      feedback: "",
      filteredProducts: [],
      showOne: true,
    };

    this.fetchAllProducts();
    this.fetchAllBikeProducts();
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this);
    this.handleRemoveFromCart2 = this.handleRemoveFromCart2.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.fetchCartFromLocalStorage();
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidMount() {
    // Retrieve search history from local storage or backend
    const searchHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    this.setState({ searchHistory });

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    this.setState({ cart: storedCart });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "feedback/addFeedback",
        { feedback: this.state.feedback }
      );
      console.log("Feedback submitted:", response.data);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  handleChange = (e) => {
    this.setState({ feedback: e.target.value });
  };

  calculateDiscountPercentage = async (mrp, price) => {
    return ((mrp - price) / mrp) * 100;
  };

  fetchAllBikeProducts = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "product/getAllProducts"
      );
      console.log("fetchAllProducts Response:", response.data);
      console.log("áddfdfsfsdf : ", response.data);

      let bikeBrands = [];
      response.data
        .filter((prod) => prod.categoryName === "Two Wheeler")
        .forEach(async (prod, index) => {
          console.log(prod.vehicleBrandModels);
          if (prod.vehicleBrandModels) {
            prod.vehicleBrandModels.forEach((vehi, index2) => {
              console.log(vehi.name);
              if (!bikeBrands.includes(vehi.name) && bikeBrands.length < 10) {
                bikeBrands.push(vehi.name);
              }
            });
            const discountPercentage = await this.calculateDiscountPercentage(
              prod.productMrpPrice,
              prod.productPrice
            );
            console.log("discounttt", discountPercentage);
            prod.discount = Math.floor(discountPercentage) + " % off";
          }
        });
      response.data
        .filter(
          (prod) => prod.categoryName === "Four Wheeler" || "Three Wheeler"
        )
        .forEach(async (prod, index) => {
          const discountPercentage = await this.calculateDiscountPercentage(
            prod.productMrpPrice,
            prod.productPrice
          );
          console.log("discounttt", discountPercentage);
          prod.discount = Math.floor(discountPercentage) + " % off";
        });
      this.setState({ products: response.data, bikeBrands: bikeBrands });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "product/getAllProducts"
      );

      let carBrands = [];
      response.data
        .filter((prod) => prod.categoryName === "Four Wheeler")
        .forEach(async (prod, index) => {
          console.log(prod.vehicleBrandModels);
          if (prod.vehicleBrandModels) {
            prod.vehicleBrandModels.forEach((vehi, index2) => {
              console.log(vehi.name);
              if (!carBrands.includes(vehi.name) && carBrands.length < 10) {
                carBrands.push(vehi.name);
              }
            });
          }
        });
      console.log("fetchAllProducts CARRRRR:", response.data);
      this.setState({ products: response.data, carBrands: carBrands });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  logout() {
    localStorage.clear();
    window.location = process.env.REACT_APP_API_URL_FOR_GUI + "/login";
    // window.location = "https://ashwinm-oo7.github.io/login";
  }

  handleAddToCart = (product) => {
    const { cart } = this.state;
    const index = cart.findIndex((item) => item._id === product._id);
    const availableQuantity = product.productQuantity;

    if (index !== -1) {
      // Product already exists in cart, update its quantity
      const updatedCart = [...cart];
      if (updatedCart[index].quantity < availableQuantity) {
        updatedCart[index].quantity += 1;
        updatedCart[index].amount =
          updatedCart[index].quantity * updatedCart[index].productPrice;
        this.setState({ cart: updatedCart }, () => {
          this.saveCartToLocalStorage(updatedCart);
        });
      }
    } else {
      // Product is not in cart, add it as a new item
      const newProduct = { ...product, quantity: 1, amount: product.price };
      const updatedCart = [...cart, newProduct];
      // const updatedCart = [...cart, { ...product, quantity: 1 }];
      this.setState({ cart: updatedCart }, () => {
        this.saveCartToLocalStorage(updatedCart);
      });
    }
  };

  isProductInCart = (product) => {
    const { cart } = this.state;
    return cart.some((item) => item._id === product._id);
  };

  getProductQuantity = (product) => {
    const { cart } = this.state;
    const index = cart.findIndex((item) => item._id === product._id);
    return index !== -1 ? cart[index].quantity : 0;
  };

  handleRemoveFromCart(index) {
    const updatedCart = [...this.state.cart];
    updatedCart.splice(index, 1);
    this.setState({ cart: updatedCart }, () => {
      this.saveCartToLocalStorage(updatedCart);
    });
  }

  handleRemoveFromCart2 = (productToRemove) => {
    const { cart } = this.state;
    const updatedCart = [...cart];
    const index = updatedCart.findIndex(
      (item) => item._id === productToRemove._id
    );

    if (index !== -1) {
      if (updatedCart[index].quantity > 1) {
        // If the quantity is greater than 1, decrement the quantity and update the amount
        updatedCart[index].quantity -= 1;
        updatedCart[index].amount -= updatedCart[index].price;
      } else {
        // If the quantity is 1, remove the product from the cart
        updatedCart.splice(index, 1);
      }

      this.setState({ cart: updatedCart }, () => {
        this.saveCartToLocalStorage(updatedCart);
      });
    }
  };

  calculateTotal() {
    let total = 0;
    this.state.cart.forEach((item) => {
      const price = parseFloat(item.productPrice);
      const quantity = parseInt(item.quantity);
      if (!isNaN(price) && !isNaN(quantity)) {
        total += price * quantity;
      }
    });
    const shippingCost = 0;
    total += shippingCost;
    return total;
  }

  handleCheckout() {
    const taxRate = 0.28;
    const subtotal = this.calculateTotal();
    const taxAmount = subtotal * taxRate;
    const finalAmount = subtotal + taxAmount;

    console.log("Subtotal:", subtotal);
    console.log("Tax (28%):", taxAmount);
    console.log("Final Amount to Pay:", finalAmount);
  }

  fetchCartFromLocalStorage() {
    const cart = localStorage.getItem("cart");
    if (cart) {
      this.setState({ cart: JSON.parse(cart) });
    }
  }

  saveCartToLocalStorage(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  fetchProductDetails = (selectedProduct) => {
    console.log("Selected Product:", selectedProduct);
    this.setState({ selectedProduct });
  };

  handleInputChange = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    console.log(searchQuery);
    const { products } = this.state;
    console.log(products);
    const filteredProducts =
      products &&
      products.filter((product) => {
        const vehicleBrandNames = product.vehicleBrandModels
          ? product.vehicleBrandModels
              .map((model) =>
                model.name
                  .replace(":", "")
                  .replace(/\s/g, "")
                  .replace(/[^\w]/g, "")
              )
              .join(" ")
          : "";

        const mrpPriceString = `${product.productMrpPrice ?? ""}${
          product.productPrice ?? ""
        }${product.tyreSize ?? ""}${
          product.productDescription ?? ""
        }`.toString();
        const normalizedMrpPrice = mrpPriceString
          .replace(/[^\d]/g, "")
          .toLowerCase();
        const searchQueryLower = searchQuery
          .replace(/[^\d]/g, "")
          .toLowerCase()
          .toString();

        return (
          vehicleBrandNames
            .toLowerCase()
            .includes(
              searchQuery
                .toLowerCase()
                .replace(":", "")
                .replace(/\s/g, "")
                .replace(/[^\w]/g, "")
            ) ||
          product.categoryName
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(
              searchQuery
                .toLowerCase()
                .replace(/\s+/g, "")
                .replace(/[^\w]/g, "")
            ) ||
          product.brandName
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(
              searchQuery
                .toLowerCase()
                .replace(/\s+/g, "")
                .replace(/[^\w]/g, "")
            ) ||
          product.productName
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(
              searchQuery
                .toLowerCase()
                .replace(/\s+/g, "")
                .replace(/[^\w]/g, "")
            ) ||
          product.subCategoryName
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(
              searchQuery
                .toLowerCase()
                .replace(/\s+/g, "")
                .replace(/[^\w]/g, "")
            ) ||
          normalizedMrpPrice
            .replace(/\s+/g, "")
            .includes(
              searchQuery
                .toLowerCase()
                .replace(/\s+/g, "")
                .replace(/[^\w]/g, "")
            )
        );
      });
    console.log(filteredProducts);

    this.setState({ searchQuery, filteredProducts });
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      this.handleSearch();
    }
  };

  handleSearch = () => {
    const { searchQuery, searchHistory } = this.state;
    if (searchQuery.trim() !== "") {
      // Save search query to history if not already present
      if (!searchHistory.includes(searchQuery)) {
        const updatedSearchHistory = [...searchHistory, searchQuery];
        this.setState({ searchHistory: updatedSearchHistory });
        localStorage.setItem(
          "searchHistory",
          JSON.stringify(updatedSearchHistory)
        );
      }

      // Perform search operation
      // Your search logic goes here
      console.log("Performing search for:", searchQuery);
    }
  };

  handleInputFocus = () => {
    this.setState({ isInputFocused: true });
  };

  // Function to handle input blur
  handleInputBlur = () => {
    this.setState({ isInputFocused: false, showSearchHistory: false });
  };

  handleRemove = (indexToRemove) => {
    this.setState((prevState) => {
      const updatedSearchHistory = prevState.searchHistory.filter(
        (_, index) => index !== indexToRemove
      );
      localStorage.setItem(
        "searchHistory",
        JSON.stringify(updatedSearchHistory)
      );
      return {
        searchHistory: updatedSearchHistory,
        // searchQuery: "",
        // isInputFocused: false,
        // showSearchHistory: false,
      };
    });
  };

  toggleFormVisibility = () => {
    this.setState({ isFormVisible: !this.state.isFormVisible });
  };
  handleRefreshPage = () => {
    window.location.reload();
  };

  render() {
    // const { cart } = this.state;

    const { searchQuery, searchHistory, filteredProducts, isInputFocused } =
      this.state;
    const { isFormVisible } = this.state;
    const { showOne: propsShowOne } = this.props; // Accessing showOne from props
    const { showOne: stateShowOne } = this.state; // Accessing showOne from state

    // Prioritizing props over state
    const showOne = propsShowOne !== undefined ? propsShowOne : stateShowOne;

    const matchingHistory = searchHistory.filter((query) =>
      query.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="" style={{ userSelect: "none" }}>
        <header class="header-area header-padding-1 sticky-bar header-res-padding clearfix">
          <div class="container-fluid">
            <div class="row">
              <div class="col-xl-2 col-lg-2 col-md-6 col-4">
                <div class="logo" title="" style={{ userSelect: "none" }}>
                  <a href="/">
                    <img
                      alt=""
                      src="assets/img/logo/tyrelogo.jpg"
                      style={{ width: "120px", height: "auto" }}
                    />
                  </a>
                </div>
              </div>
              <div class="col-xl-8 col-lg-8 d-none d-lg-block">
                <div class="main-menu" style={{ backgroundColor: "#e6e6ff" }}>
                  <nav>
                    <ul>
                      <li>
                        <a href="/">
                          <FaCar /> Cars <i class="fa fa-angle-down"></i>
                        </a>
                        <ul class="mega-menu mega-menu-padding">
                          <li>
                            <ul>
                              <li class="mega-menu-title">
                                <a>Four Wheeler</a>
                              </li>
                              {this.state.carBrands.map((vehi, index2) => (
                                <li>
                                  <a href="#" key={index2}>
                                    {vehi}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li>
                          <li>
                            <ul>
                              <li class="mega-menu-img">
                                <a href="#">
                                  <img
                                    src="assets/img/cars/car.webp"
                                    style={{ width: "400px" }}
                                    alt=""
                                  />
                                  <img
                                    src="assets/img/cars/4tyre.webp"
                                    style={{ width: "450px" }}
                                    alt=""
                                  />
                                </a>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <a href="#">
                          <FaBicycle /> Bike <i class="fa fa-angle-down"></i>{" "}
                        </a>
                        <ul class="mega-menu" style={{ width: "600px" }}>
                          <li>
                            <ul>
                              <li class="mega-menu-title">
                                <a href="#">Two Wheeler</a>
                              </li>
                              {this.state.bikeBrands.map((vehi, index2) => (
                                <li>
                                  <a href="#" key={index2}>
                                    {vehi}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li>
                          <li>
                            <ul>
                              <li class="mega-menu-img">
                                <a href="#">
                                  <img
                                    src="assets/img/cars/scooter.webp"
                                    style={{ width: "350px" }}
                                    alt=""
                                  />
                                </a>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a href="#">
                          <FaShoppingCart /> CartNew
                          <span class="count-style">
                            {this.state.cart.length}
                          </span>
                          <i class="fa fa-angle-down"></i>{" "}
                        </a>
                        <ul class="mega-menu" style={{ width: "600px" }}>
                          <ul>
                            <div class=" mega-menu" style={{ top: "-21px" }}>
                              <button
                                class="icon-cart"
                                //  onClick={this.handleCartClick}
                              >
                                <i class="pe-7s-shopbag"></i>
                                <span class="count-style">
                                  {this.state.cart.length}
                                </span>
                              </button>
                              <div
                                className="shopping-cart-content"
                                style={{
                                  maxHeight: "300px",
                                  overflowY: "auto",
                                }}
                              >
                                <ul>
                                  {/* <FaSyncAlt
                          color="#827f7f"
                          title="Refresh"
                          style={{ marginLeft: "80px", fontSize: "20px" }}
                          className="refresh-button"
                          onClick={this.handleRefreshPage}
                        /> */}
                                  {this.state.cart.map((item, index) => (
                                    <li
                                      class="single-shopping-cart"
                                      key={index}
                                    >
                                      <div class="shopping-cart-img">
                                        <a href="#">
                                          <img
                                            alt=""
                                            src={item.productImages[0].dataURL}
                                            style={{
                                              width: "50px",
                                              height: "50px",
                                            }}
                                          />
                                        </a>
                                      </div>
                                      <div class="quantity-controls">
                                        <FaMinus
                                          className={
                                            item.quantity > 1
                                              ? "quantity-button minus"
                                              : "quantity-button minus disabled"
                                          }
                                          onClick={() =>
                                            item.quantity > 1 &&
                                            this.handleRemoveFromCart2(item)
                                          }
                                        />
                                        <div
                                          class="quantity-display"
                                          style={{
                                            userSelect: "none",
                                            pointerEvents: "none",
                                          }}
                                        >
                                          {item.quantity}
                                        </div>
                                        <FaPlus
                                          className="quantity-button plus"
                                          onClick={() =>
                                            this.handleAddToCart(item)
                                          }
                                        />
                                      </div>
                                      <div class="shopping-cart-delete">
                                        <button
                                          style={{ top: "-80px" }}
                                          onClick={() =>
                                            this.handleRemoveFromCart(index)
                                          }
                                        >
                                          <i className="fa fa-times-circle"></i>
                                        </button>
                                      </div>
                                      <div class="shopping-cart-title">
                                        <h4>
                                          <a href="#">
                                            {item.tyreSize}
                                            <span
                                              style={{ marginRight: "5px" }}
                                            ></span>
                                            {item.productName}
                                          </a>
                                        </h4>
                                        <h6>
                                          Available Stock :
                                          {item.productQuantity - item.quantity}
                                        </h6>
                                        <span>
                                          &#8377; : {item.productPrice} /pcs
                                        </span>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                                {/* *******CART TOTAL *********** */}
                                <div class="shopping-cart-total">
                                  <h4>
                                    {/* Shipping : <span>&#8377;20.00</span> */}
                                  </h4>
                                  <h4>
                                    SubTotal:
                                    <span className="shop-total">
                                      &#8377;{this.calculateTotal()}
                                    </span>
                                  </h4>
                                  <h4>
                                    Tax (28%):
                                    <span className="shop-total">
                                      &#8377;
                                      {(this.calculateTotal() * 0.28).toFixed(
                                        2
                                      )}
                                    </span>
                                  </h4>
                                  <h4>
                                    Final Amount to Pay:
                                    <span>
                                      &#8377;
                                      {(this.calculateTotal() * 1.28).toFixed(
                                        2
                                      )}
                                    </span>
                                  </h4>
                                </div>
                                <div class="shopping-cart-btn btn-hover text-center">
                                  <Link to="/cart-page" class="default-btn">
                                    view cart
                                  </Link>
                                  <button
                                    className="default-btn"
                                    onClick={this.handleCheckout}
                                  >
                                    Checkout
                                  </button>
                                </div>
                              </div>
                            </div>
                          </ul>
                        </ul>
                      </li>
                      <li>
                        <a href="#">
                          <FaInfoCircle /> Details
                          <i class="fa fa-angle-down"></i>
                        </a>
                        <ul class="submenu">
                          <li>
                            <p>
                              <Link to="/login">login / register</Link>
                            </p>
                          </li>
                          <li>
                            <a href="/about">about us</a>
                          </li>
                          <li>
                            <a href="#">cart page</a>
                          </li>
                          <li>
                            <Link to="/cart-page">checkout</Link>
                          </li>
                          <li>
                            <a href="#">wishlist </a>
                          </li>
                          <li>
                            <Link to="/myAccount">My Account</Link>
                          </li>
                          <li>
                            <a href="#">contact us </a>
                          </li>
                          <li>
                            <a href="#">404 page </a>
                          </li>
                        </ul>
                      </li>
                      {/* <li>
                        <a href="#">
                          Blog <i class="fa fa-angle-down"></i>
                        </a>
                        <ul class="submenu">
                          <li>
                            <a href="#">blog standard</a>
                          </li>
                          <li>
                            <a href="#">blog no sidebar</a>
                          </li>
                          <li>
                            <a href="#">blog right sidebar</a>
                          </li>
                          <li>
                            <a href="#">blog details 1</a>
                          </li>
                          <li>
                            <a href="#">blog details 2</a>
                          </li>
                          <li>
                            <a href="#">blog details 3</a>
                          </li>
                        </ul>
                      </li> */}
                      {/* <li>
                        <a href="/about"> About </a>
                      </li> */}
                      {/* <li>
                        <a href="/categories">
                          Categories <i class="fa fa-angle-down"></i>
                        </a>
                        <ul class="submenu">
                          <li>
                            <a href="/CategoryList">
                              CategoryList
                            </a>
                          </li>
                          <li>
                            <a href="#">blog no sidebar</a>
                          </li>
                          <li>
                            <a href="#">blog right sidebar</a>
                          </li>
                          <li>
                            <a href="#">blog details 1</a>
                          </li>
                          <li>
                            <a href="#">blog details 2</a>
                          </li>
                          <li>
                            <a href="#">blog details 3</a>
                          </li>
                        </ul>
                      </li> */}
                      {localStorage.getItem("isAdmin") === "true" ? (
                        <li>
                          <a href="#">
                            <FaUserShield /> Masters{" "}
                            <i class="fa fa-angle-down"></i>
                          </a>
                          <ul class="submenu">
                            <li>
                              <a href="/add-brand">Add Brand</a>
                            </li>
                            <li>
                              <a href="/CategoryList">CategoryList</a>
                            </li>
                            <li>
                              <a href="/puncture-repair-list?isAdmin=true">
                                Puncture Repair List
                              </a>
                            </li>
                            <li>
                              <a href="/product-list">Product List</a>
                            </li>
                            <li>
                              <a href="/feedback-list">Feedback List</a>
                            </li>
                          </ul>
                        </li>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </nav>
                </div>
              </div>
              <div class="col-xl-2 col-lg-2 col-md-6 col-8">
                <div class="header-right-wrap">
                  <div class="same-style header-search">
                    <a
                      class="search-active"
                      href="#"
                      style={{ maxWidth: "300%" }}
                    >
                      <i class="pe-7s-search" title="search karle"></i>
                    </a>
                    <div
                      class="search-content"
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        maxWidth: "300%",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Search..."
                        value={this.state.searchQuery}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleKeyDown}
                        onFocus={this.handleInputFocus}
                        onBlur={this.handleInputBlur}
                      />
                      {/* <button onClick={this.handleSearch}>Search</button> */}
                      <div>
                        {/* <h9>Search History:</h9> */}
                        {searchQuery.trim() === "" &&
                          matchingHistory.length > 0 &&
                          isInputFocused && (
                            <div>
                              {searchHistory.map((query, index) => (
                                <div
                                  key={index}
                                  className="search-history-item"
                                >
                                  <span
                                    onClick={() =>
                                      this.setState({ searchQuery: query })
                                    }
                                  >
                                    {query}
                                  </span>
                                  <span
                                    className="remove-icon"
                                    onClick={() => this.handleRemove(index)}
                                  >
                                    X
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>

                      <ul>
                        {/* {searchResults.map((result) => (
                            <li key={result.id}>{result.name}</li>
                          ))}
                          <i class="pe-7s-search"></i> */}
                        <div>
                          {searchQuery === "" ? (
                            <div>
                              {/* Render your blank page content here */}
                            </div>
                          ) : (
                            <div>
                              {/* Render your search results */}
                              {filteredProducts.length === 0 ? (
                                <div>
                                  <h3>No results found</h3>
                                </div>
                              ) : (
                                <div class="row">
                                  {filteredProducts.map((prod, index) => (
                                    <div
                                      // class="shopping-cart-content cart-visible"
                                      class="tab-pane"
                                      key={index}
                                    >
                                      <div class="product-wrap mb-25">
                                        <div class="product-img" style={{}}>
                                          {[0, 1].map((index1) => (
                                            <img
                                              key={index1}
                                              alt=""
                                              src={
                                                prod.productImages[index1]
                                                  .dataURL
                                              }
                                              style={{
                                                width: "50px",
                                                height: "50px",
                                                marginRight: "10px",
                                              }}
                                            />
                                          ))}
                                        </div>
                                        <div class="product-content text-center">
                                          <h5>{prod.subCategoryName}</h5>
                                          <h3>
                                            <a href="#">{prod.productName}</a>
                                          </h3>
                                          <h3>
                                            <span>{prod.tyreSize}</span>
                                          </h3>
                                          <div class="product-rating">
                                            {/* Render product rating */}
                                          </div>
                                          <div class="product-price">
                                            <span>₹ {prod.productPrice}</span>
                                            <span class="old">
                                              ₹ {prod.productMrpPrice}
                                            </span>
                                          </div>
                                          {/* Render add to cart button */}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </ul>
                    </div>
                  </div>
                  {localStorage.getItem("userEmail") ? (
                    <div class="same-style account-satting">
                      <a class="account-satting-active" href="#">
                        <i class="pe-7s-user-female"></i>
                      </a>
                      <div class="account-dropdown">
                        <ul>
                          <li>
                            <a onClick={() => this.logout()} href="/login">
                              {localStorage.getItem("userEmail")
                                ? "Logout"
                                : "Login"}{" "}
                            </a>
                          </li>

                          <li>
                            <a href="/sign-up">Register</a>
                          </li>
                          <li>
                            <a href="#">Wishlist </a>
                          </li>
                          <li>
                            <Link to="/myAccount">My Account</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div class="same-style account-satting">
                      <a class="account-satting-active" href="#">
                        <i class="pe-7s-user-female"></i>
                      </a>
                      <div class="account-dropdown">
                        <ul>
                          <li>
                            <a onClick={() => this.logout()} href="/login">
                              {localStorage.getItem("userEmail")
                                ? "Logout"
                                : "Login"}{" "}
                            </a>
                          </li>

                          <li>
                            <a href="/sign-up">Register</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  {this.state.selectedProduct && (
                    <div class="same-style header-wishlist">
                      <a href="#">
                        <i class="pe-7s-like"></i>
                        {/* <p>{this.state.selectedProduct.productName}</p> */}
                      </a>
                    </div>
                  )}
                  {/* 888888888888 CART LIST 888888888888888888888888888 */}
                  <div
                    class="same-style mega-menu cart-wrap"
                    style={{ top: "-21px" }}
                  >
                    <button
                      class="icon-cart"
                      //  onClick={this.handleCartClick}
                    >
                      <i class="pe-7s-shopbag"></i>
                      <span class="count-style">{this.state.cart.length}</span>
                    </button>
                    <div
                      className="shopping-cart-content"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      <ul>
                        {/* <FaSyncAlt
                          color="#827f7f"
                          title="Refresh"
                          style={{ marginLeft: "80px", fontSize: "20px" }}
                          className="refresh-button"
                          onClick={this.handleRefreshPage}
                        /> */}
                        {this.state.cart.map((item, index) => (
                          <li class="single-shopping-cart" key={index}>
                            <div class="shopping-cart-img">
                              <a href="#">
                                <img
                                  alt=""
                                  src={item.productImages[0].dataURL}
                                  style={{ width: "50px", height: "50px" }}
                                />
                              </a>
                            </div>
                            <div class="quantity-controls">
                              <FaMinus
                                className={
                                  item.quantity > 1
                                    ? "quantity-button minus"
                                    : "quantity-button minus disabled"
                                }
                                onClick={() =>
                                  item.quantity > 1 &&
                                  this.handleRemoveFromCart2(item)
                                }
                              />
                              <div
                                class="quantity-display"
                                style={{
                                  userSelect: "none",
                                  pointerEvents: "none",
                                }}
                              >
                                {item.quantity}
                              </div>
                              <FaPlus
                                className="quantity-button plus"
                                onClick={() => this.handleAddToCart(item)}
                              />
                            </div>
                            <div class="shopping-cart-delete">
                              <button
                                style={{ top: "-80px" }}
                                onClick={() => this.handleRemoveFromCart(index)}
                              >
                                <i className="fa fa-times-circle"></i>
                              </button>
                            </div>
                            <div class="shopping-cart-title">
                              <h4>
                                <a href="#">
                                  {item.tyreSize}
                                  <span style={{ marginRight: "5px" }}></span>
                                  {item.productName}
                                </a>
                              </h4>
                              <h6>
                                Available Stock :
                                {item.productQuantity - item.quantity}
                              </h6>
                              <span>&#8377; : {item.productPrice} /pcs</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {/* *******CART TOTAL *********** */}
                      <div class="shopping-cart-total">
                        <h4>{/* Shipping : <span>&#8377;20.00</span> */}</h4>
                        <h4>
                          SubTotal:
                          <span className="shop-total">
                            &#8377;{this.calculateTotal()}
                          </span>
                        </h4>
                        <h4>
                          Tax (28%):
                          <span className="shop-total">
                            &#8377;{(this.calculateTotal() * 0.28).toFixed(2)}
                          </span>
                        </h4>
                        <h4>
                          Final Amount to Pay:
                          <span>
                            &#8377;{(this.calculateTotal() * 1.28).toFixed(2)}
                          </span>
                        </h4>
                      </div>
                      <div class="shopping-cart-btn btn-hover text-center">
                        <Link to="/cart-page" class="default-btn">
                          view cart
                        </Link>
                        <button
                          className="default-btn"
                          onClick={this.handleCheckout}
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 77777777777777777777 */}
            </div>
            <div class="mobile-menu-area">
              <div class="mobile-menu" style={{ marginTop: "-" }}>
                <nav id="mobile-menu-active">
                  <ul class="menu-overflow">
                    {localStorage.getItem("isAdmin") === "true" ? (
                      <li>
                        <a href="#">
                          Masters <i class=""></i>
                        </a>
                        <ul class="submenu">
                          <li>
                            <a href="/add-brand">Add Brand</a>
                          </li>
                          <li>
                            <a href="/CategoryList">CategoryList</a>
                          </li>
                          <li>
                            <a href="/puncture-repair-list?isAdmin=true">
                              Puncture Repair List
                            </a>
                          </li>
                          <li>
                            <a href="/product-list">Product List</a>
                          </li>
                          <li>
                            <a href="/feedback-list">Feedback List</a>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      <></>
                    )}
                    <li>
                      <a href="/home">HOME</a>
                      <ul>
                        <li>
                          <a href="#">Collection</a>
                          <ul>
                            <li>
                              <a href="#">Two Wheeler</a>
                            </li>
                            <li>
                              <a href="#">Three Wheeler</a>
                            </li>
                            <li>
                              <a href="#">Four Wheeler</a>
                            </li>
                            <li>
                              <a href="#">Puncture Material Kit</a>
                            </li>
                            <li>
                              <a href="#">Tubes</a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Shop</a>
                      <ul>
                        <li>
                          <a href="#">Tyre Company</a>
                          <ul>
                            <li>
                              <a href="https://www.mrftyres.com/">MRF</a>
                            </li>
                            <li>
                              <a href="https://www.ceat.com/">CEAT</a>
                            </li>
                            <li>
                              <a href="https://www.bridgestone.co.in/">
                                Bridge Stone
                              </a>
                            </li>
                            <li>
                              <a href="https://jktyre.com/">JK Tyre</a>
                            </li>
                            <li>
                              <a href="https://tvseurogrip.com/">TVS</a>
                            </li>
                            <li>
                              <a href="https://www.goodyear.co.in/">GoodYear</a>
                            </li>
                            <li>
                              <a href="https://www.michelin.in/">Michelin</a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    {/* {localStorage.getItem("isAdmin") === "true" ? (
                      <li>
                        <a>Master Admin</a>
                        <ul>
                          <li>
                            <a href="/add-brand">Add Brand</a>
                          </li>
                          <li>
                            <a href="/puncture-repair-list?isAdmin=true&isAdmin=true">
                              Puncture Repair List
                            </a>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      <></>
                    )} */}
                    <li>
                      <a>Pages</a>
                      <ul>
                        <li>
                          <a href="/about">about us</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}
