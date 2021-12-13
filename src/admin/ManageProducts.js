//  ./src/admin/ManageProducts.js
import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { getProducts, deleteProduct } from "./ApiAdmin";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);

  const { user, token } = isAuthenticated();

  function loadProducts() {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.log);
      } else {
        setProducts(data);
      }
    });
  }

  function destroy(productId) {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadProducts();
      }
    });
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Layout
      title="Manage Products"
      description="Perform CRUD on products"
      className="container-fluid"
    >
      <h2 className="text-center">Total {products.length} products</h2>
      <hr />

      {products.map((p, i) => (
        <li key={i} className="list-group-item">
          <div className="row">
            <div className="col-6">
              <strong>{p.name}</strong>
            </div>
            <div className="col-3">
              <Link to={`/admin/product/update/${p._id}`}>
                <span className="badge badge-warning badge-pill">Update</span>
              </Link>
            </div>
            <div className="col-3">
              <span
                onClick={() => destroy(p._id)}
                className="badge badge-danger badge-pill"
              >
                Delete
              </span>
            </div>
          </div>
        </li>
      ))}
    </Layout>
  );
}
