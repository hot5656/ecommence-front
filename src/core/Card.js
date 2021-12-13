// ./src/core/Card.js
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import moment from "moment";
import ShowImage from "./ShowImage";
import { addItem, updateItem, removeItem } from "./cartHelpers";

export default function Card({
  product,
  showViewProductButton = true,
  showAddCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  handelUpdate,
}) {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  function showViewButton(showViewProductButton) {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button className="btn btn-outline-primary mt-2 mb-2 mr-2">
            View Product
          </button>
        </Link>
      )
    );
  }

  function addToCart() {
    addItem(product, () => {
      setRedirect(true);
    });
  }

  function shouldRedirect(redirect) {
    if (redirect) {
      return <Navigate replace to="/cart" />;
    }
  }

  function showAddToCard(showAddCartButton) {
    return (
      showAddCartButton && (
        <button
          onClick={addToCart}
          className="btn btn-outline-warning mt-2 mb-2"
        >
          Add to card
        </button>
      )
    );
  }

  function showRemoveButton(showRemoveProductButton) {
    return (
      showRemoveProductButton && (
        <button
          onClick={() => {
            handelUpdate();
            removeItem(product._id);
          }}
          className="btn btn-outline-danger mt-2 mb-2"
        >
          Remove Product
        </button>
      )
    );
  }

  function showStock(quantity) {
    return quantity > 0 ? (
      <span className="badge badge-primary badge-pill">In Stock</span>
    ) : (
      <span>Out of Stock</span>
    );
  }

  const handleChange = (productId) => (e) => {
    // console.log(productId, e.target.value);
    handelUpdate();
    setCount(e.target.value < 1 ? 1 : e.target.value);
    if (e.target.value >= 1) {
      updateItem(productId, e.target.value);
    }
  };

  function showCartUpdateotions(CartUpdate) {
    return (
      cartUpdate && (
        <div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Adjust Quantity</span>
            </div>
            <input
              type="number"
              className="form-control"
              value={count}
              onChange={handleChange(product._id)}
            />
          </div>
        </div>
      )
    );
  }

  return (
    <div className="card">
      <div className="card-header name">{product.name}</div>
      <div className="card-body">
        {shouldRedirect(redirect)}
        <ShowImage item={product} url="product" />
        {/* <p>{`<<${product.category.name}>>`}</p> */}
        <p className="lead mt-2">{product.description.substring(0, 100)}</p>
        <p className="black-10">${product.price}</p>
        <p className="black-9">
          Category: {product.category && product.category.name}
        </p>
        <p className="black-8">
          Added on {moment(product.createdAt).fromNow()}
        </p>
        {showStock(product.quantity)}
        <br />
        {showViewButton(showViewProductButton)}
        {showAddToCard(showAddCartButton)}
        {showRemoveButton(showRemoveProductButton)}
        {showCartUpdateotions(cartUpdate)}
      </div>
    </div>
  );
}
