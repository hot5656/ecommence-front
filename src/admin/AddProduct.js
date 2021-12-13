//  ./src/admin/AddProduct.js
import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { createProduct, getCategories } from "./ApiAdmin";

export default function AddProduct() {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    shipping: "",
    quantity: "",
    photo: "",
    loading: false,
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    formData: "",
  });

  // destructure user and token from localStorage
  const { user, token } = isAuthenticated();
  const {
    name,
    description,
    price,
    categories,
    // shipping,
    quantity,
    // photo,
    loading,
    error,
    createdProduct,
    // redirectToProfile,
    formData,
  } = values;

  // load categories and set from data.error
  const init = () => {
    getCategories().then((data) => {
      // console.log("****data:", data);
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
        });
      } else {
        // FormData 可建立表單資料中的欄位/值建立相對應的的鍵/值對（key/value）集合
        setValues({
          ...values,
          // 移除 含 data 欄位
          categories: data,
          formData: new FormData(),
        });
      }
    });
  };

  useEffect(() => {
    init();
    // FormData 可建立表單資料中的欄位/值建立相對應的的鍵/值對（key/value）集合
    // setValues({ ...values, formData: new FormData() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    const name = e.target.name;
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    // set formData's velue
    formData.set(name, value);
    setValues({
      ...values,
      [e.target.name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    setValues({
      ...values,
      error: "",
      loading: true,
    });

    // ***--->>> call API function 要加 return 才能 then 處理
    createProduct(user._id, token, formData).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
        });
      } else {
        setValues({
          ...values,
          name: "",
          description: "",
          price: "",
          quantity: "",
          photo: "",
          loading: false,
          createdProduct: data.name,
        });
      }
    });
  }

  // // 使用此種寫法不用加 {} and retuen
  const newProductForm = () => (
    <form onSubmit={handleSubmit} className="mb-3">
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input
            id="photo_uploades"
            onChange={handleChange}
            name="photo"
            type="file"
            accepr="image/*"
          />
        </label>
        <br />
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange}
          name="name"
          type="text"
          className="form-control"
          value={name}
        />
        <label className="text-muted">Description</label>
        <textarea
          onChange={handleChange}
          name="description"
          type="text"
          className="form-control"
          value={description}
        />
        <label className="text-muted">Price</label>
        <input
          onChange={handleChange}
          name="price"
          type="text"
          className="form-control"
          value={price}
        />
        <label className="text-muted">Category</label>
        <select
          onChange={handleChange}
          name="category"
          className="form-control"
        >
          {/* <option value="618cccaac104434a41b7e4e7">Node</option>
          <option value="618d2aeb3cc4d2fb8b0ffa6c">python</option> */}
          <option>Please select</option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
        <label className="text-muted">Shipping</label>
        <select
          onChange={handleChange}
          name="shipping"
          className="form-control"
        >
          <option>Please select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
        <label className="text-muted">Quantity</label>
        <input
          onChange={handleChange}
          name="quantity"
          type="number"
          className="form-control"
          value={quantity}
        />
      </div>
      <button className="btn btn-outline-primary">Create Product</button>
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: createdProduct ? "" : "none" }}
    >
      <h2>{`${createdProduct}`} is created</h2>
    </div>
  );

  const showLoading = () => {
    loading && (
      <div className="alert alert-success">
        <h2>Loading...</h2>
      </div>
    );
  };

  return (
    <Layout
      title="Add a new product"
      description={`G'day ${user.name}, ready to add a product?`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newProductForm()}
        </div>
      </div>
    </Layout>
  );
}
