import React, { Component, useState } from "react";
import { FaBicycle, FaCar, FaMinus, FaPlus, FaSyncAlt } from "react-icons/fa";
import axios from "axios";
import "../css/home.css";
import { Link } from "react-router-dom";
import Header from "./Header";

export default class HomePage extends Component {
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
      const price = parseFloat(item.productPrice); // Conshvert to number
      const quantity = parseInt(item.quantity); // Convert to number
      if (!isNaN(price) && !isNaN(quantity)) {
        total += price * quantity; // Multiply price by quantity
      }
    });
    const shippingCost = 0; // Assuming shipping cost is $20
    total += shippingCost;
    return total;
  }

  handleCheckout() {
    const taxRate = 0.28;
    const subtotal = this.calculateTotal();
    const taxAmount = subtotal * taxRate;
    const finalAmount = subtotal + taxAmount;

    // Display the checkout information
    console.log("Subtotal:", subtotal);
    console.log("Tax (28%):", taxAmount);
    console.log("Final Amount to Pay:", finalAmount);

    // You can perform additional actions here, such as sending the checkout information to the server or navigating to a checkout page
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
    console.log("Selected Product:", selectedProduct); // For debugging
    // Perform any additional actions to fetch product details as needed
    this.setState({ selectedProduct });
  };

  handleInputChange = (event) => {
    const searchQuery = event.target.value; // Get the search query entered by the user
    const { products } = this.state;

    const filteredProducts = products.filter((product) => {
      const vehicleBrandNames = product.vehicleBrandModels
        .map((model) =>
          model.name.replace(":", "").replace(/\s/g, "").replace(/[^\w]/g, "")
        )
        .join(" ");

      const mrpPriceString = `${product.productMrpPrice ?? ""}${
        product.productPrice ?? ""
      }${product.tyreSize ?? ""}${product.productDescription ?? ""}`.toString(); // Concatenate multiple properties into a single string

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
            searchQuery.toLowerCase().replace(/\s+/g, "").replace(/[^\w]/g, "")
          ) ||
        product.brandName
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(
            searchQuery.toLowerCase().replace(/\s+/g, "").replace(/[^\w]/g, "")
          ) ||
        product.productName
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(
            searchQuery.toLowerCase().replace(/\s+/g, "").replace(/[^\w]/g, "")
          ) ||
        product.subCategoryName
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(
            searchQuery.toLowerCase().replace(/\s+/g, "").replace(/[^\w]/g, "")
          ) ||
        normalizedMrpPrice
          .replace(/\s+/g, "")
          .includes(
            searchQuery.toLowerCase().replace(/\s+/g, "").replace(/[^\w]/g, "")
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
        <header></header>

        <div class="slider-area">
          <div class="slider-active owl-carousel nav-style-1 owl-dot-none">
            <div class="single-slider slider-height-1 bg-purple">
              <div class="container">
                <div class="row">
                  <div class="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-6">
                    <div class="slider-content slider-animated-1">
                      <h3 class="animated"> Tubeless Tyre</h3>
                      <h1 class="animated">
                        Choose Best Tyre Offer <br />
                        2024 Collection
                      </h1>
                      <div class="slider-btn btn-hover">
                        <a class="animated" href="#">
                          SHOP NOW
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-6">
                    <div class="slider-single-img slider-animated-1">
                      <img
                        class="animated"
                        src="assets/img/slider/Ceat.webp"
                        alt=""
                      />
                      <img
                        class="animated"
                        src="assets/img/slider/Ceat2.webp"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="single-slider slider-height-1 bg-purple">
              <div class="container">
                <div class="row">
                  <div class="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-6">
                    <div class="slider-content slider-animated-1">
                      <h3 class="animated"> All Type of Variants</h3>
                      <h1 class="animated">
                        Best Services <br />
                        ALL TIME
                      </h1>
                      <div class="slider-btn btn-hover">
                        <a class="animated" href="#">
                          SHOP NOW
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-6">
                    <div class="slider-single-img slider-animated-1">
                      <img
                        class="animated"
                        src="assets/img/slider/Ceat4.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="suppoer-area pt-100 pb-60">
          <div class="container">
            <div class="row">
              <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="support-wrap mb-30 support-1">
                  <div class="support-icon">
                    <img
                      class="animated"
                      src="assets/img/icon-img/support-1.webp"
                      alt=""
                    />
                  </div>
                  <div class="support-content">
                    <h5>Free Shipping</h5>
                    <p>Free shipping on all order</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-6">
                <a href="/puncture-repair">
                  <div class="support-wrap mb-30 support-2">
                    <div class="support-icon">
                      <img
                        class="animated"
                        src="assets/img/icon-img/tyre-repair.jpg"
                        alt=""
                      />
                    </div>
                    <div class="support-content">
                      <h5>Tyre Puncture Service</h5>
                      <p>Tyre Puncture Service For All Tyre</p>
                    </div>
                  </div>
                </a>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="support-wrap mb-30 support-3">
                  <div class="support-icon">
                    <img
                      class="animated"
                      src="assets/img/icon-img/support-3.webp"
                      alt=""
                    />
                  </div>
                  <div class="support-content">
                    <h5>Money Return</h5>
                    <p>T&C apply</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="support-wrap mb-30 support-4">
                  <div class="support-icon">
                    <img
                      class="animated"
                      src="assets/img/icon-img/support-4.webp"
                      alt=""
                    />
                  </div>
                  <div class="support-content">
                    <h5>Order Discount</h5>
                    <p>Best Offer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="product-area pb-60">
          <div class="container">
            <div class="section-title text-center">
              <h2>DAILY DEALS!</h2>
            </div>
            <div class="product-tab-list nav pt-30 pb-55 text-center">
              <a href="#product-1" data-bs-toggle="tab">
                <h4>Two Wheeler </h4>
              </a>
              <a class="active" href="#product-2" data-bs-toggle="tab">
                <h4>Four Wheeler </h4>
              </a>
              <a href="#product-3" data-bs-toggle="tab">
                <h4>Three Wheeler</h4>
              </a>
            </div>
            <div class="tab-content jump">
              <div class="tab-pane" id="product-1">
                <div class="row">
                  {this.state.products
                    .filter((prod) => prod.categoryName === "Two Wheeler")
                    .map((prod, index, quantity) => (
                      <div class="col-xl-3 col-md-6 col-lg-4 col-sm-6">
                        <div class="product-wrap mb-25">
                          <div
                            class="product-img"
                            style={{ userSelect: "none" }}
                          >
                            <a href="##" key={index}>
                              <img
                                className="default-img"
                                src={prod.productImages[1].dataURL}
                                alt={`Imagee ${index}`}
                              />
                              <img
                                className="hover-img"
                                src={prod.productImages[0].dataURL}
                                alt={`Imagee ${index}`}
                              />
                            </a>
                            <span
                              class="pink"
                              style={{
                                userSelect: "none",
                                pointerEvents: "none",
                              }}
                            >
                              {prod.discount}
                            </span>
                            <div
                              class="product-action"
                              onClick={() => {
                                this.setState({ selectedProduct: prod });
                              }}
                            >
                              <div
                                class="pro-same-action pro-wishlist"
                                onClick={() => {
                                  this.setState({ selectedProduct: prod });
                                }}
                              >
                                <a title="Wishlist" href="##">
                                  <i class="pe-7s-like"></i>
                                </a>
                              </div>
                              <div className="pro-same-action pro-cart">
                                {this.isProductInCart(prod) &&
                                this.getProductQuantity(prod) > 0 ? (
                                  <FaMinus
                                    className="quantity-button minus"
                                    onClick={() =>
                                      this.handleRemoveFromCart2(prod)
                                    }
                                  />
                                ) : null}
                                {this.isProductInCart(prod) ? (
                                  <button
                                    style={{
                                      backgroundColor: "transparent",
                                      fontSize: "14px",
                                      textAlign: "center",
                                      lineHeight: "1.8",
                                    }}
                                    onClick={() => this.handleAddToCart(prod)}
                                    title="Add To Cart"
                                  >
                                    <i className="pe-7s-cart"></i>
                                    {this.getProductQuantity(prod)} Added In
                                    Cart
                                  </button>
                                ) : (
                                  <button
                                    style={{
                                      backgroundColor: "transparent",
                                      userSelect: "none",
                                    }}
                                    onClick={() => this.handleAddToCart(prod)}
                                    title="Add To Cart"
                                  >
                                    <i className="pe-7s-cart"></i> Add to cart
                                  </button>
                                )}
                              </div>

                              <div class="pro-same-action pro-quickview">
                                <a
                                  title="Quick View"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                >
                                  <i class="pe-7s-look"></i>
                                </a>
                              </div>
                            </div>
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
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o"></i>
                              <i class="fa fa-star-o"></i>
                            </div>
                            <div class="product-price">
                              <span>₹ {prod.productPrice}</span>
                              <span class="old">₹ {prod.productMrpPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div class="tab-pane active" id="product-2">
                <div class="row">
                  {this.state.products
                    .filter((prod) => prod.categoryName === "Four Wheeler")
                    .map((prod, index, quantity) => (
                      <div class="col-xl-3 col-md-6 col-lg-4 col-sm-6">
                        <div class="product-wrap mb-25">
                          <div
                            class="product-img"
                            style={{ userSelect: "none" }}
                          >
                            <a href="##" key={index}>
                              <img
                                className="default-img magic1"
                                src={prod.productImages[1].dataURL}
                                alt={`Imagee ${index}`}
                              />
                              <img
                                className="hover-img"
                                src={prod.productImages[0].dataURL}
                                alt={`Imagee ${index}`}
                              />
                            </a>
                            <span
                              class="pink"
                              style={{
                                userSelect: "none",
                                pointerEvents: "none",
                              }}
                            >
                              {prod.discount}
                            </span>
                            <div
                              class="product-action"
                              onClick={() => {
                                this.setState({ selectedProduct: prod });
                              }}
                            >
                              <div
                                class="pro-same-action pro-wishlist"
                                onClick={() => {
                                  this.setState({ selectedProduct: prod });
                                }}
                              >
                                <a title="Wishlist" href="##">
                                  <i class="pe-7s-like"></i>
                                </a>
                              </div>
                              <div className="pro-same-action pro-cart">
                                {this.isProductInCart(prod) &&
                                this.getProductQuantity(prod) > 0 ? (
                                  <FaMinus
                                    className="quantity-button minus"
                                    onClick={() =>
                                      this.handleRemoveFromCart2(prod)
                                    }
                                  />
                                ) : null}
                                {this.isProductInCart(prod) ? (
                                  <button
                                    style={{
                                      backgroundColor: "transparent",
                                      fontSize: "14px",
                                      textAlign: "center",
                                      lineHeight: "1.8",
                                    }}
                                    onClick={() => this.handleAddToCart(prod)}
                                    title="Add To Cart"
                                  >
                                    <i className="pe-7s-cart"></i>
                                    {this.getProductQuantity(prod)} Added In
                                    Cart
                                  </button>
                                ) : (
                                  <button
                                    style={{
                                      backgroundColor: "transparent",
                                      userSelect: "none",
                                    }}
                                    onClick={() => this.handleAddToCart(prod)}
                                    title="Add To Cart"
                                  >
                                    <i className="pe-7s-cart"></i> Add to cart
                                  </button>
                                )}
                              </div>

                              <div class="pro-same-action pro-quickview">
                                <a
                                  title="Quick View"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                >
                                  <i class="pe-7s-look"></i>
                                </a>
                              </div>
                            </div>
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
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o"></i>
                              <i class="fa fa-star-o"></i>
                            </div>
                            <div class="product-price">
                              <span>₹ {prod.productPrice}</span>
                              <span class="old">₹ {prod.productMrpPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div class="tab-pane" id="product-3">
                <div class="row">
                  {this.state.products
                    .filter((prod) => prod.categoryName === "Three Wheeler")
                    .map((prod, index, quantity) => (
                      <div class="col-xl-3 col-md-6 col-lg-4 col-sm-6">
                        <div class="product-wrap mb-25">
                          <div
                            class="product-img"
                            style={{ userSelect: "none" }}
                          >
                            <a href="##" key={index}>
                              <img
                                className="default-img"
                                src={prod.productImages[1].dataURL}
                                alt={`Imagee ${index}`}
                              />
                              <img
                                className="hover-img"
                                src={prod.productImages[0].dataURL}
                                alt={`Imagee ${index}`}
                              />
                            </a>
                            <span
                              class="pink"
                              style={{
                                userSelect: "none",
                                pointerEvents: "none",
                              }}
                            >
                              {prod.discount}
                            </span>
                            <div
                              class="product-action"
                              onClick={() => {
                                this.setState({ selectedProduct: prod });
                              }}
                            >
                              <div
                                class="pro-same-action pro-wishlist"
                                onClick={() => {
                                  this.setState({ selectedProduct: prod });
                                }}
                              >
                                <a title="Wishlist" href="##">
                                  <i class="pe-7s-like"></i>
                                </a>
                              </div>
                              <div className="pro-same-action pro-cart">
                                {this.isProductInCart(prod) &&
                                this.getProductQuantity(prod) > 0 ? (
                                  <FaMinus
                                    className="quantity-button minus"
                                    onClick={() =>
                                      this.handleRemoveFromCart2(prod)
                                    }
                                  />
                                ) : null}
                                {this.isProductInCart(prod) ? (
                                  <button
                                    style={{
                                      backgroundColor: "transparent",
                                      fontSize: "14px",
                                      textAlign: "center",
                                      lineHeight: "1.8",
                                    }}
                                    onClick={() => this.handleAddToCart(prod)}
                                    title="Add To Cart"
                                  >
                                    <i className="pe-7s-cart"></i>
                                    {this.getProductQuantity(prod)} Added In
                                    Cart
                                  </button>
                                ) : (
                                  <button
                                    style={{
                                      backgroundColor: "transparent",
                                      userSelect: "none",
                                    }}
                                    onClick={() => this.handleAddToCart(prod)}
                                    title="Add To Cart"
                                  >
                                    <i className="pe-7s-cart"></i> Add to cart
                                  </button>
                                )}
                              </div>

                              <div class="pro-same-action pro-quickview">
                                <a
                                  title="Quick View"
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                >
                                  <i class="pe-7s-look"></i>
                                </a>
                              </div>
                            </div>
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
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o"></i>
                              <i class="fa fa-star-o"></i>
                            </div>
                            <div class="product-price">
                              <span>₹ {prod.productPrice}</span>
                              <span class="old">₹ {prod.productMrpPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="blog-area pb-55">
          <div class="container">
            <div class="section-title text-center mb-55">
              <h2>OUR BLOG</h2>
            </div>
            {/* <div class="row"></div> */}
            <div class="row">
              {this.state.products
                .filter((prod) => prod.categoryName)
                .map((prod, index, quantity) => (
                  <div class="col-xl-3 col-md-6 col-lg-4 col-sm-6">
                    <div class="product-wrap mb-25">
                      <div class="product-img" style={{ userSelect: "none" }}>
                        <a href="##" key={index}>
                          <img
                            className="default-img"
                            src={prod.productImages[0].dataURL}
                            alt={`Imagee ${index}`}
                          />
                          <img
                            className="hover-img"
                            src={prod.productImages[1].dataURL}
                            alt={`Imagee ${index}`}
                          />
                        </a>
                        <span
                          class="pink"
                          style={{
                            userSelect: "none",
                            pointerEvents: "none",
                          }}
                        >
                          {prod.discount}
                        </span>
                        <div
                          class="product-action"
                          onClick={() => {
                            this.setState({ selectedProduct: prod });
                          }}
                        >
                          <div
                            class="pro-same-action pro-wishlist"
                            onClick={() => {
                              this.setState({ selectedProduct: prod });
                            }}
                          >
                            <a title="Wishlist" href="##">
                              <i class="pe-7s-like"></i>
                            </a>
                          </div>
                          <div className="pro-same-action pro-cart">
                            {this.isProductInCart(prod) &&
                            this.getProductQuantity(prod) > 0 ? (
                              <FaMinus
                                className="quantity-button minus"
                                onClick={() => this.handleRemoveFromCart2(prod)}
                              />
                            ) : null}
                            {this.isProductInCart(prod) ? (
                              <button
                                style={{
                                  backgroundColor: "transparent",
                                  fontSize: "14px",
                                  textAlign: "center",
                                  lineHeight: "1.8",
                                }}
                                onClick={() => this.handleAddToCart(prod)}
                                title="Add To Cart"
                              >
                                <i className="pe-7s-cart"></i>
                                {this.getProductQuantity(prod)} Added In Cart
                              </button>
                            ) : (
                              <button
                                style={{
                                  backgroundColor: "transparent",
                                  userSelect: "none",
                                }}
                                onClick={() => this.handleAddToCart(prod)}
                                title="Add To Cart"
                              >
                                <i className="pe-7s-cart"></i> Add to cart
                              </button>
                            )}
                          </div>

                          <div class="pro-same-action pro-quickview">
                            <a
                              title="Quick View"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              <i class="pe-7s-look"></i>
                            </a>
                          </div>
                        </div>
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
                          <i class="fa fa-star-o yellow"></i>
                          <i class="fa fa-star-o yellow"></i>
                          <i class="fa fa-star-o yellow"></i>
                          <i class="fa fa-star-o"></i>
                          <i class="fa fa-star-o"></i>
                        </div>
                        <div class="product-price">
                          <span>₹ {prod.productPrice}</span>
                          <span class="old">₹ {prod.productMrpPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <footer class="footer-area bg-gray pt-100 pb-70">
          <div class="container">
            <div class="row">
              <div class="col-lg-2 col-md-4 col-sm-4">
                <div class="copyright mb-30">
                  <div class="footer-logo">
                    <a href="#">
                      <img
                        alt=""
                        src="assets/img/logo/tyrelogo.jpg"
                        style={{ width: "120px", height: "auto" }}
                      />
                    </a>
                  </div>
                  <p>
                    © 2024 <a href="#">Tyrewala</a>.<br /> All Rights Reserved
                  </p>
                </div>
              </div>
              <div class="col-lg-2 col-md-4 col-sm-4">
                <div class="footer-widget mb-30 ml-30">
                  <div class="footer-title">
                    <h3>ABOUT US</h3>
                  </div>
                  <div class="footer-list">
                    <ul>
                      <li>
                        <a href="/about">About us</a>
                      </li>
                      <li>
                        <a href="/">Store location : Jogeshwari Mumbai(102)</a>
                      </li>
                      <li>
                        <a href="#">Contact : ashwinmaurya9211@gmail.com</a>
                      </li>
                      {/* <li>
                        <a href="#">Orders tracking</a>
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-lg-2 col-md-4 col-sm-4">
                <div class="footer-widget mb-30 ml-50">
                  <div class="footer-title">
                    <h3>USEFUL LINKS</h3>
                  </div>
                  <div class="footer-list">
                    <ul>
                      <li>
                        <a href="#">Returns</a>
                      </li>
                      <li>
                        <a href="#">Support Policy</a>
                      </li>
                      <li>
                        <a href="#">Size guide</a>
                      </li>
                      <li>
                        <a href="#">FAQs</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-lg-2 col-md-6 col-sm-6">
                <div class="footer-widget mb-30 ml-75">
                  <div class="footer-title">
                    <h3>FOLLOW US</h3>
                  </div>
                  <div class="footer-list">
                    <ul>
                      <li>
                        <a
                          class="fa fa-facebook"
                          href="https://www.facebook.com/ASHMI6oo7/"
                        >
                          &nbsp; Facebook
                        </a>
                      </li>
                      <li>
                        <a
                          class="fa fa-linkedin"
                          href="https://www.linkedin.com/in/ashwini-kumar-maurya-531554205/"
                        >
                          &nbsp; linkedin
                        </a>
                      </li>
                      <li>
                        <a
                          class="fa fa-instagram"
                          href="https://www.instagram.com/ashwin_oo7/"
                        >
                          &nbsp; Instagram
                        </a>
                      </li>
                      <li>
                        <a
                          class="fa fa-youtube"
                          href="https://www.youtube.com/channel/UCXE9IrBDQDwf2If_S6XKKiw"
                        >
                          &nbsp; Youtube
                        </a>
                      </li>
                      <li>
                        <button
                          className="feedback-button"
                          id="feedback-button"
                          onClick={this.toggleFormVisibility}
                        >
                          Leave Feedback
                        </button>
                        {isFormVisible && (
                          <div className="feedback-form">
                            <form onSubmit={this.handleSubmit}>
                              <label htmlFor="feedback">Your Feedback:</label>
                              <textarea
                                id="feedback"
                                name="feedback"
                                rows="4"
                                cols="50"
                                onChange={this.handleChange}
                                placeholder="Enter your feedback here..."
                              ></textarea>
                              <input type="submit" value="Submit" />
                            </form>
                          </div>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-6">
                <div class="footer-widget mb-30 ml-70">
                  <div class="footer-title">
                    <h3>SUBSCRIBE</h3>
                  </div>
                  <div class="subscribe-style">
                    <p>
                      Get E-mail updates about our latest shop and special
                      offers.
                    </p>
                    <div id="mc_embed_signup" class="subscribe-form">
                      <form
                        id="mc-embedded-subscribe-form"
                        class="validate"
                        novalidate=""
                        target="_blank"
                        name="mc-embedded-subscribe-form"
                        method="post"
                        action="#"
                      >
                        <div id="mc_embed_signup_scroll" class="mc-form">
                          <input
                            class="email"
                            type="email"
                            required=""
                            placeholder="Enter your email here.."
                            name="EMAIL"
                            value=""
                          />
                          <div class="mc-news" aria-hidden="true">
                            <input
                              type="text"
                              value=""
                              tabindex="-1"
                              name="b_6bbb9b6f5827bd842d9640c82_05d85f18ef"
                            />
                          </div>
                          <div class="clear">
                            <input
                              id="mc-embedded-subscribe"
                              class="button"
                              type="submit"
                              name="subscribe"
                              value="Subscribe"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Modal */}

        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
            <div class="modal-content" style={{ maxWidth: "100%" }}>
              <div class="modal-header">
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              {this.state.selectedProduct && (
                <div
                  class="modal-body"
                  onClick={() =>
                    this.fetchProductDetails(this.state.selectedProduct)
                  }
                >
                  <div class="row">
                    <div class="col-md-5 col-sm-12 col-xs-12">
                      <div class="tab-content quickview-big-img">
                        <div id="pro-1" class="tab-pane fade show active">
                          <img
                            src={
                              this.state.selectedProduct.productImages[0]
                                .dataURL
                            }
                            alt=""
                          />
                        </div>
                        {this.state.selectedProduct.productImages.map(
                          (image, index) => (
                            <div
                              id={`pro-${index + 1}`}
                              class={`tab-pane fade ${
                                index === 1 ? "show active" : ""
                              }`}
                            >
                              <img src={image.dataURL} alt="" />
                            </div>
                          )
                        )}

                        <div id="pro-3" class="tab-pane fade">
                          <img
                            src={
                              this.state.selectedProduct.productImages[1]
                                .dataURL
                            }
                            alt=""
                          />
                        </div>
                        <div id="pro-4" class="tab-pane fade">
                          <img
                            src={
                              this.state.selectedProduct.productImages[1]
                                .dataURL
                            }
                            alt=""
                          />
                        </div>
                      </div>
                      {/* Thumbnail Large Image End */}
                      {/* Thumbnail Image End */}
                      <div class="quickview-wrap mt-15">
                        <div
                          class="quickview-slide-active owl-carousel nav nav-style-1"
                          role="tablist"
                        >
                          <a class="active" data-bs-toggle="tab" href="#pro-1">
                            <img
                              src={
                                this.state.selectedProduct.productImages[1]
                                  .dataURL
                              }
                              alt=""
                            />
                          </a>
                          <a data-bs-toggle="tab" href="#pro-2">
                            <img
                              src={
                                this.state.selectedProduct.productImages[1]
                                  .dataURL
                              }
                              alt=""
                            />
                          </a>
                          <a data-bs-toggle="tab" href="#pro-3">
                            <img
                              src={
                                this.state.selectedProduct.productImages[1]
                                  .dataURL
                              }
                              alt=""
                            />
                          </a>
                          <a data-bs-toggle="tab" href="#pro-4">
                            <img
                              src={
                                this.state.selectedProduct.productImages[1]
                                  .dataURL
                              }
                              alt=""
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                    {this.state.selectedProduct && (
                      <div
                        class="col-md-7 col-sm-12 col-xs-12"
                        onClick={() =>
                          this.fetchProductDetails(this.state.selectedProduct)
                        }
                      >
                        <div class="product-details-content quickview-content">
                          <h2>{this.state.selectedProduct.brandName}</h2>
                          <div class="product-details-price">
                            <span>
                              &#8377;{this.state.selectedProduct.productPrice}
                            </span>
                            <span class="old">
                              &#8377;
                              {this.state.selectedProduct.productMrpPrice}
                            </span>
                          </div>
                          <div class="pro-details-rating-wrap">
                            <div class="pro-details-rating">
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o yellow"></i>
                              <i class="fa fa-star-o"></i>
                              <i class="fa fa-star-o"></i>
                            </div>
                            <span>3 Reviews</span>
                          </div>
                          <p>
                            {this.state.selectedProduct.categoryName}
                            <br />
                            {this.state.selectedProduct.subCategoryName}
                            <br />
                            {this.state.selectedProduct.productName}
                          </p>
                          <div class="pro-details-list">
                            <ul>
                              <li> {this.state.selectedProduct.tyreSize}</li>
                              {/* <li>- Inspired vector icons</li>
                              <li>- Very modern style </li> */}
                            </ul>
                          </div>
                          <div class="pro-details-size-color">
                            <div class="pro-details-color-wrap">
                              {/* <span>Color</span> */}
                              <div class="pro-details-color-content">
                                <ul>{/* <li class="black"></li> */}</ul>
                              </div>
                            </div>
                            <div class="pro-details-size">
                              {/* <span>Size</span> */}
                              {/* <div class="pro-details-size-content">
                                <ul>
                                  <li>
                                    <a href="#">s</a>
                                  </li>
                                  <li>
                                    <a href="#">m</a>
                                  </li>
                                  <li>
                                    <a href="#">l</a>
                                  </li>
                                  <li>
                                    <a href="#">xl</a>
                                  </li>
                                  <li>
                                    <a href="#">xxl</a>
                                  </li>
                                </ul>
                              </div> */}
                            </div>
                          </div>
                          <div class="pro-details-quality" style={{}}>
                            <div class="pro-details-cart btn-hover" style={{}}>
                              {this.isProductInCart(
                                this.state.selectedProduct
                              ) &&
                              this.getProductQuantity(
                                this.state.selectedProduct
                              ) > 0 ? (
                                <div
                                  className="remove-button-container"
                                  style={{
                                    marginLeft: "-25px",
                                    marginBottom: "-35px",
                                    paddingRight: "5px",
                                  }}
                                >
                                  <FaMinus
                                    style={{}}
                                    title="Remove"
                                    className="quantity-button minus"
                                    onClick={() =>
                                      this.handleRemoveFromCart2(
                                        this.state.selectedProduct
                                      )
                                    }
                                  />
                                </div>
                              ) : null}
                              {this.isProductInCart(
                                this.state.selectedProduct
                              ) ? (
                                <button
                                  style={{
                                    backgroundColor: "blue",
                                    marginTop: "0px",
                                  }}
                                  onClick={() =>
                                    this.handleAddToCart(
                                      this.state.selectedProduct
                                    )
                                  }
                                  title="Add To Cart"
                                >
                                  <i className="pe-7s-cart"></i>{" "}
                                  {this.getProductQuantity(
                                    this.state.selectedProduct
                                  )}
                                  Added In Cart
                                </button>
                              ) : (
                                <button
                                  style={{
                                    backgroundColor: "blue",
                                    marginTop: "0px",
                                  }}
                                  onClick={() =>
                                    this.handleAddToCart(
                                      this.state.selectedProduct
                                    )
                                  }
                                  title="Add To Cart"
                                >
                                  <i className="pe-7s-cart"></i>
                                  &nbsp;&nbsp;&nbsp;Add To
                                  Cart&nbsp;&nbsp;&nbsp;
                                </button>
                              )}
                            </div>
                            <div style={{}}>
                              <button
                                style={{
                                  backgroundColor: "blue",
                                  marginTop: "-3px",
                                  borderRadius: "115px",
                                }}
                              >
                                <a
                                  href="/cart-page"
                                  className="view-cart"
                                  style={{
                                    color: "white",
                                    textDecoration: "none",
                                  }}
                                >
                                  View Cart
                                </a>
                              </button>
                            </div>

                            <div
                              class="pro-details-wishlist"
                              style={{ paddingLeft: "5px" }}
                            >
                              <a href="#">
                                <i class="fa fa-heart-o"></i>
                              </a>
                            </div>
                            <div class="pro-details-compare">
                              <a href="#">
                                <i class="pe-7s-shuffle"></i>
                              </a>
                            </div>
                          </div>

                          {/* <div class="pro-details-meta">
                            <span>Categories :</span>
                            <ul>
                              <li>
                                <a href="#">Minimal,</a>
                              </li>
                              <li>
                                <a href="#"></a>
                              </li>
                              <li>
                                <a href="#"></a>
                              </li>
                            </ul>
                          </div> */}
                          {/* <div class="pro-details-meta">
                            <span>Tag :</span>
                            <ul>
                              <li>
                                <a href="#"> </a>
                              </li>
                              <li>
                                <a href="#"></a>
                              </li>
                              <li>
                                <a href="#"></a>
                              </li>
                            </ul>
                          </div> */}

                          <div class="pro-details-social">
                            <ul>
                              <li>
                                <a href="https://www.facebook.com/ASHMI6oo7/">
                                  <i class="fa fa-facebook"></i>
                                </a>
                              </li>
                              <li>
                                <a href="https://www.youtube.com/@ashwin0401">
                                  <i class="fa fa-youtube"></i>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i class="fa fa-twitter"></i>
                                </a>
                              </li>
                              <br />
                              <li>
                                <a href="https://www.linkedin.com/in/ashwini-kumar-maurya-531554205/">
                                  <i class="fa fa-linkedin"></i>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal end */}
      </div>
    );
  }
}
