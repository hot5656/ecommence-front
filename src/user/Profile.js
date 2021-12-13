// ./src/user/Profile.js
import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "./apiUser";

export default function Profile({ match }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: false,
    success: false,
  });

  const { token } = isAuthenticated();
  const { name, email, password, success } = values;
  const { userId } = useParams(); // v6 react-router-dom

  function init(userId) {
    // console.log(userId);
    read(userId, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: true });
      } else {
        setValues({ ...values, name: data.name, email: data.email });
      }
    });
  }

  useEffect(() => {
    // init(match.params.userId); // v5 react-router-dom
    init(userId); // v6 react-router-dom
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  function redirectUser(success) {
    if (success) {
      return <Navigate to="/cart" />;
    }
  }

  function handSubmit(e) {
    e.preventDefault();
    update(userId, token, { name, email, password }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        updateUser(data, () => {
          setValues({
            ...values,
            name: data.name,
            email: data.email,
            success: true,
          });
        });
      }
    });
  }

  function profileUpdate(name, email, password) {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            type="text"
            onChange={handleChange("name")}
            className="form-control"
            value={name}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            type="email"
            onChange={handleChange("email")}
            className="form-control"
            value={email}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            type="password"
            onChange={handleChange("password")}
            className="form-control"
            value={password}
          />
        </div>
        <button onClick={handSubmit} className="btn btn-primary">
          Submit
        </button>
      </form>
    );
  }

  return (
    <Layout
      title="Profile"
      description="Update your profile"
      className="container-fluid"
    >
      <h2 className="mb-4">Profile Update</h2>
      {profileUpdate(name, email, password)}
      {redirectUser(success)}
    </Layout>
  );
}
