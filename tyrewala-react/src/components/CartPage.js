import React, { Component } from "react";
import {
  FaBicycle,
  FaTimes,
  FaMinus,
  FaPlus,
  FaTrash,
  FaSyncAlt,
} from "react-icons/fa";
import "../css/Cart/CartPage.css";

class CartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
    };
  }

  componentDidMount() {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    this.setState({ cart: storedCart });
  }
  handleRefreshPage = () => {
    window.location.reload();
  };

  handleAddToCart = (product) => {
    const { cart } = this.state;
    const index = cart.findIndex((item) => item.id === product.id);
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

  handleRemoveFromCart = (index) => {
    this.setState((prevState) => {
      const updatedCart = [...prevState.cart];
      updatedCart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    });
  };

  handleRemoveFromCart2 = (productToRemove) => {
    const { cart } = this.state;
    const updatedCart = [...cart];
    const index = updatedCart.findIndex(
      (item) => item.id === productToRemove.id
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
  saveCartToLocalStorage(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  handleClearCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear the cart?"
    );
    if (confirmed) {
      this.setState({ cart: [] });
      localStorage.removeItem("cart");
    } else {
      // If the user cancels, no action is taken
      console.log("Clear cart action cancelled.");
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

  render() {
    const { cart } = this.state;

    return (
      <div>
        <h2 className="cart-heading">
          <span className="cart-heading-text" title="Cart Item List">
            Cart Items
            <FaSyncAlt
              color="#827f7f"
              title="Refresh"
              style={{ marginLeft: "80px", fontSize: "20px" }}
              className="refresh-button"
              onClick={this.handleRefreshPage}
            />
          </span>
          <FaTrash
            className="clear-cart-button"
            style={{ fontSize: "20px" }}
            title="Clear Cart"
            onClick={this.handleClearCart}
          />
        </h2>

        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <div className="cart-item-container">
                <div className="cart-image-container">
                  {[0, 1].map((index) => (
                    <img
                      key={index}
                      alt=""
                      src={item.productImages[index].dataURL}
                      className="cart-image"
                    />
                  ))}

                  {/* <FaTimes
                    className="cart-remove"
                    style={{ fontSize: "24px" }}
                    onClick={() => this.handleRemoveFromCart(index)}
                  /> */}
                </div>
                <div className="cart-remove-container">
                  <FaTimes
                    title="Remove-Item"
                    className="cart-remove"
                    onClick={() => this.handleRemoveFromCart(index)}
                  />
                </div>

                <div className="cart-details">
                  <p>
                    <strong>Brand Name:</strong> {item.brandName}
                  </p>
                  <p>
                    <strong>Model:</strong> {item.productName}
                  </p>
                  <p>
                    <strong>Size:</strong> {item.tyreSize}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Price:</strong> {item.productPrice}/pcs
                  </p>
                  <p className="mrp">
                    <strong>MRP:</strong> ₹ {item.productMrpPrice}
                  </p>
                  <div class="cart-quantity-controls">
                    <FaMinus
                      className={
                        item.quantity > 1
                          ? "cart-quantity-button minus"
                          : "cart-quantity-button minus disabled"
                      }
                      onClick={() =>
                        item.quantity > 1 && this.handleRemoveFromCart2(item)
                      }
                    />
                    <div
                      class="cart-quantity-display"
                      style={{
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                    >
                      {item.quantity}
                    </div>
                    <FaPlus
                      className="cart-quantity-button plus"
                      onClick={() => this.handleAddToCart(item)}
                    />
                  </div>

                  {/* Add more details as needed */}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div></div>
        {/* <div class="cart-shopping-total">
          <p>
            <strong className="label">
              SubTotal :
              <span className="cart-shop-total">
                &#8377;{this.calculateTotal()}
              </span>
            </strong>
          </p>
          <p>
            <strong className="label">
              Tax (28%) :
              <span className="cart-shop-total">
                &#8377;{(this.calculateTotal() * 0.28).toFixed(2)}
              </span>
            </strong>
          </p>
          <p>
            <strong className="label">
              Final Amount to Pay :
              <span className="cart-shop-total">
                &#8377;{(this.calculateTotal() * 1.28).toFixed(2)}
              </span>
            </strong>
          </p>
          <p>
            <strong></strong>
          </p>
        </div> */}
        <div className="cart-shopping-total">
          <div className="total-item">
            <strong className="label-total">SubTotal :</strong>
            <span className="cart-shop-total">
              &#8377;{this.calculateTotal()}
            </span>
          </div>
          <div className="total-item">
            <strong className="label-tax">Tax (28%) :</strong>
            <span className="cart-shop-total">
              &#8377;{(this.calculateTotal() * 0.28).toFixed(2)}
            </span>
          </div>
          <div className="total-item">
            <strong className="label">Final Amount to Pay :</strong>
            <span className="cart-shop-total">
              &#8377;{(this.calculateTotal() * 1.28).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default CartPage;
