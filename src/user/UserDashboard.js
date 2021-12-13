// ./src/core/UserDashboard.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getPurchaseHistory } from "./apiUser";
import moment from "moment";

export default function UserDashboard() {
  const [history, setHistory] = useState([]);

  const {
    user: { _id, name, email, role },
  } = isAuthenticated();
  const token = isAuthenticated().token;

  function init(userId, token) {
    getPurchaseHistory(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setHistory(data);
      }
    });
  }

  useEffect(() => {
    init(_id, token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userLinks = () => (
    <div className="card">
      <h3 className="card-header">User Links</h3>
      <ul className="list-group">
        <li className="list-group-item">
          <Link className="nav-link" to="/cart">
            My Cart
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to={`/profile/${_id}`}>
            Update Profile
          </Link>
        </li>
      </ul>
    </div>
  );

  const userInfo = () => (
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

  const purchaseHistory = (history) => (
    <div className="card mb-5">
      <div className="card-header">Purchase history</div>
      <ul className="list-group">
        <li className="list-group-item">
          {history.map((h, i) => {
            return (
              <div>
                <hr />
                {h.products.map((p, i) => {
                  return (
                    <div key={i}>
                      <h6>Product name: {p.name}</h6>
                      <h6>Product price: ${p.price}</h6>
                      <h6>Purchased date: {moment(h.updatedAt).fromNow()}</h6>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </li>
      </ul>
    </div>
  );

  return (
    <Layout
      title="Dashboard Page"
      description="User Dashboard"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-3">{userLinks()}</div>
        <div className="col-9">
          {userInfo()}
          {purchaseHistory(history)}
        </div>
      </div>
    </Layout>
  );
}
