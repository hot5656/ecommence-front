// ./src/core/AdminDashboard.js
import React from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";

export default function AdmintDashboard() {
  const {
    user: { name, email, role },
  } = isAuthenticated();

  const adminLinks = () => (
    <div className="card">
      <h3 className="card-header">Admin Links</h3>
      <ul className="list-group">
        <li className="list-group-item">
          <Link className="nav-link" to="/create/category">
            Create Category
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to="/create/product">
            Create Product
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to="/admin/orders">
            View Orders
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to="/admin/products">
            Manage Products
          </Link>
        </li>
      </ul>
    </div>
  );

  // ***--->>> 使用 arrow 函數,可省略 return
  const adminInfo = () => (
    <div className="card">
      <h3 className="card-header">{`G'Day ${name}!`}</h3>
      <ul className="list-group">
        <li className="list-group-item">{name}</li>
        <li className="list-group-item">{email}</li>
        <li className="list-group-item">
          {role === 1 ? "Admin" : "Registrred User"}
        </li>
      </ul>
    </div>
  );

  return (
    <Layout
      title="Dashboard Page"
      description="Admin Dashboard"
      className="container-fluid"
    >
      <div className="row">
        {/* ***--->>> 使用 arrow 函數,可省略 return */}
        <div className="col-3">{adminLinks()}</div>
        <div className="col-9">{adminInfo()}</div>
      </div>
    </Layout>
  );
}
