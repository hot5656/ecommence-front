//  ./src/admin/Orders.js
import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { listOrders, getStatusValues, updateOrderStatus } from "./ApiAdmin";
import moment from "moment";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const { user, token } = isAuthenticated();

  function loadOrders() {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
  }

  function loadStatusValue() {
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  }

  useEffect(() => {
    loadOrders();
    loadStatusValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showOrdersLength() {
    if (orders.length > 0) {
      return (
        <h1 className="text-danger display-2">Total orders: {orders.length}</h1>
      );
    } else {
      <h1 className="text-danger">No orders</h1>;
    }
  }

  function handleStatusChange(e, orderId) {
    console.log("update order status");
    updateOrderStatus(user._id, token, orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log("status update field");
      } else {
        loadOrders();
      }
    });
  }

  function showStatus(o) {
    // console.log(statusValues);
    return (
      <div className="from-group">
        <h3 className="mark mb-4">Status: {o.status}</h3>
        <select
          className="from-control"
          onChange={(e) => handleStatusChange(e, o._id)}
        >
          <option>Update Status</option>
          {statusValues.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <Layout
      title="Orsers"
      description={`G'day ${user.name}, you can manage all the orders here`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showOrdersLength()}
          {orders.map((o, oIndex) => {
            return (
              <div
                className="mt-5"
                key={oIndex}
                style={{ borderBottom: "5px solid indigo" }}
              >
                <h2 className="mb-5">
                  <span className="bg-primary">Order:{o._id}</span>
                </h2>
                <ul className="list-group mb-2">
                  <li className="list-group-item">
                    {o.status}
                    {showStatus(o)}
                  </li>
                  <li className="list-group-item">
                    Transaction ID: {o.transaction_id}
                  </li>
                  <li className="list-group-item">Amount: {o.amount}</li>
                  <li className="list-group-item">Order By: {o.user.name}</li>
                  <li className="list-group-item">
                    Ordered on: {moment(o.createdAt).fromNow()}
                  </li>
                  <li className="list-group-item">
                    Delivery address: {o.address}
                  </li>
                </ul>
                <h3 className="mt-4 mb-4 font-italic">
                  Total products in the orders: {o.products.length}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
