// ./src/core/Cart.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { getCart } from "./cartHelpers";
import Card from "./Card";
import Checkout from "./Checkout";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [updateScreen, setUpdateScreen] = useState(true);

  useEffect(() => {
    setItems(getCart());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateScreen]);

  function handleUpdateScreen() {
    setUpdateScreen(!updateScreen);
  }

  function showItems(items) {
    return (
      <div>
        <h2>Your cart has {items.length} items</h2>
        <hr />
        {items.map((product, i) => (
          <Card
            key={i}
            product={product}
            showAddCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
            handelUpdate={handleUpdateScreen}
          />
        ))}
      </div>
    );
  }

  function noItemsMessage() {
    return (
      <h2>
        Your cart is empty.
        <br />
        <Link to="/shop"> Continue shopping</Link>
      </h2>
    );
  }

  return (
    <Layout
      title="Shopping Cart"
      description="Manage your cart items. Add remove checkout or continue shopping"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-6">
          {items.length > 0 ? showItems(items) : noItemsMessage()}
        </div>
        <div className="col-6">
          <h2 className="mb-4">Your cart summy</h2>
          <hr />
          <Checkout
            products={items}
            handelUpdate={handleUpdateScreen}
          ></Checkout>
        </div>
      </div>
    </Layout>
  );
}
