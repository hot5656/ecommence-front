// ./src/AppRoutes.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Singin";
import UserDashboard from "./user/UserDashboard";
import AdminDashboard from "./user/AdminDashboard";
import UserRequireAuth from "./auth/UserAuth";
import AdminRequireAuth from "./auth/AdminAuth";
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
import Shop from "./core/Shop";
import Product from "./core/Product";
import Cart from "./core/Cart";
import Orders from "./admin/Orders";
import Profile from "./user/Profile";
import ManageProducts from "./admin/ManageProducts";
import UpdateProduct from "./admin/UpdateProduct";

export default function AppRoutes() {
  // console.log("APP render...");
  return (
    <div>
      <BrowserRouter>
        {/* react-router-dom v6
				   1. "Switch" is replaced by routes "Routes"
					 2. component put to element */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/user/dashboard"
            element={
              <UserRequireAuth>
                <UserDashboard />
              </UserRequireAuth>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRequireAuth>
                <AdminDashboard />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/create/category"
            element={
              <AdminRequireAuth>
                <AddCategory />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/create/product"
            element={
              <AdminRequireAuth>
                <AddProduct />
              </AdminRequireAuth>
            }
          />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/admin/orders"
            element={
              <AdminRequireAuth>
                <Orders />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <UserRequireAuth>
                <Profile />
              </UserRequireAuth>
            }
          />
          <Route
            path="/admin/products"
            element={
              <UserRequireAuth>
                <ManageProducts />
              </UserRequireAuth>
            }
          />
          <Route
            path="/admin/product/update/:productId"
            element={
              <AdminRequireAuth>
                <UpdateProduct />
              </AdminRequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
