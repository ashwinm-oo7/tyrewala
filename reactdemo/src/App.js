import React from "react";

import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/login";
import SignUp from "./components/signup";
import HomePage from "./components/HomePage";
import About from "./components/about";
import Categories from "./components/categories";
import Subcategories from "./components/subcategories";
import CategoryList from "./components/CategoryList";

import ProductCreation from "./components/ProductCreation";
import AddBrand from "./components/AddBrand";

import { ToastContainer } from "react-toastify";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import PunctureRepair from "./components/PunctureRepair";
import PunctureRepairList from "./components/PunctureRepairList";
import Feedback from "./components/Feedback";
import MyAccount from "./components/MyAccount";
import CartPage from "./components/CartPage";
import Header from "./components/Header";

class Home extends React.Component {
  render() {
    return (
      <div className="app">
        {/* <h1>Tyre Wala</h1> */}

        <div className="navigation">
          <Header />
        </div>
        <div className="content">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="home" element={<HomePage />} />
            <Route path="about" element={<About />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<Subcategories />} />
            <Route path="categorylist" element={<CategoryList />} />
            <Route path="productcreation" element={<ProductCreation />} />
            <Route path="add-brand" element={<AddBrand />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="puncture-repair" element={<PunctureRepair />} />
            <Route path="header" element={<Header />} />
            <Route
              path="puncture-repair-list"
              element={<PunctureRepairList />}
            />
            <Route path="feedback-list" element={<Feedback />} />
            <Route path="myAccount" element={<MyAccount />} />
            <Route path="cart-page" element={<CartPage />} />

            <Route path="*" element={<Login />} />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    );
  }
}

export default Home;
