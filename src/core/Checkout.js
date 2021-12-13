// ./src/core/Checkout.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { isAuthenticated } from "../auth";
import {
  getBraintreeClientToken,
  processPayment,
  createOrder,
} from "./apiCore";
import { emptyCart } from "./cartHelpers";

export default function Checkout({ products, handelUpdate }) {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  useEffect(() => {
    getToken(userId, token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getTotal() {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  }

  function getToken(userId, token) {
    getBraintreeClientToken(userId, token).then((response) => {
      if (response.error) {
        setData({ ...data, error: response.error });
      } else {
        // setData({ ...data, clientToken: response.clientToken });
        setData({ clientToken: response.clientToken });
      }
    });
  }

  function showCheckout() {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    );
  }

  let deliveryAddress = data.address;

  function handleBuy() {
    setData({ ...data, loading: true });
    // send the nonce to your server
    // nunce = data.instance.requestPaymentMethod()
    let nonce;
    // console.log("data", data);
    if (products.length) {
      // let getNonce = data.instance
      data.instance
        .requestPaymentMethod()
        .then((data) => {
          // console.log(data);
          nonce = data.nonce;
          // once you have nonce (Card type, card number) send nonce as paymentMethodNonce
          // and also total to be charged
          // console.log(
          //   "send nonce and total to process : ",
          //   nonce,
          //   getTotal(products)
          // );
          const paymentData = {
            paymentMethodNonce: nonce,
            amount: getTotal(products),
            // merchant_account_id: "dhewgthty",
          };

          processPayment(userId, token, paymentData)
            .then((response) => {
              // create order
              const createOrderData = {
                products: products,
                transaction_id: response.transaction.id,
                amount: response.transaction.amount,
                address: deliveryAddress,
              };
              createOrder(userId, token, createOrderData).then((response) => {
                emptyCart(() => {
                  handelUpdate();
                  // console.log("payment success and empty cart");
                  setData({ ...data, loading: false, success: true });
                });
              });
            })
            .catch((error) => {
              console.log(error);
              setData({ ...data, loading: false });
            });
        })
        .catch((error) => {
          console.log("dropin error: ", error);
          setData({ ...data, error: error.message });
        });
    }
  }

  function shwoSucess(success) {
    return (
      <div
        className="alert alert-info"
        style={{ display: success ? "" : "none" }}
      >
        Thanks! Your Payment was successful!
      </div>
    );
  }

  function shwoLoading(loading) {
    return loading && <h2>Loading...</h2>;
  }

  function shwoError(error) {
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
    );
  }

  function handleAddress(e) {
    setData({ ...data, address: e.target.value });
  }

  function showDropIn() {
    return (
      <div onBlur={() => setData({ ...data, error: "" })}>
        {data.clientToken != null && products.length > 0 ? (
          <div>
            <div className="gorm-grop mb-3">
              <label className="text-muted">Delivery address:</label>
              <textarea
                onChange={handleAddress}
                className="form-control"
                value={data.address}
                placeholder="Type your deliver address here ..."
              />
            </div>
            <DropIn
              options={{
                authorization: data.clientToken,
                // ad paypal option
                paypal: {
                  flow: "vault",
                },
              }}
              onInstance={(instance) => (data.instance = instance)}
            />
            <button onClick={handleBuy} className="btn btn-success btn-block">
              Pay
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {shwoLoading(data.loading)}
      {shwoSucess(data.success)}
      {shwoError(data.error)}
      {showCheckout()}
    </div>
  );
}
