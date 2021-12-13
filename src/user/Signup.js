//  ./src/user/Signup.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { signup } from "../auth";

export default function Singup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });

  const { name, email, password, error, success } = values;

  function handleChange(e) {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // catch 傳回用 .then 處理
    signup({ name, email, password }).then((data) => {
      // undefidata === undefined 表 server 未回應
      if (data === undefined) {
        // console.log("Server not response");
        setValues({
          ...values,
          error: "Server not response",
          success: false,
        });
      } else if (data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
        });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          success: true,
        });
      }
    });
  }

  // 使用此種寫法不用加 {} and retuen
  const signUpForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange}
          name="name"
          type="text"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange}
          name="email"
          type="text"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange}
          name="password"
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <button onClick={handleSubmit} className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  // 使用此種寫法不用加 {} and retuen
  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  // 使用此種寫法不用加 {} and retuen
  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      New acount is coreated. Please <Link to="/signin">Sigin</Link>
    </div>
  );

  return (
    <Layout
      title="Singup Page"
      description="Singup to Node React E-commerce"
      className="container col-md-6 col-md-3"
    >
      {showError()}
      {showSuccess()}
      {signUpForm()}
    </Layout>
  );
}
