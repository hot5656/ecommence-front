//  ./src/admin/UpdateProduct.js
import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getProduct, getCategories, updateProduct } from "./ApiAdmin";

export default function UpdateProduct() {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    shipping: "",
    quantity: "",
    photo: "",
    loading: false,
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    formData: "",
  });

  const [categories, setCategories] = useState([]);

  // destructure user and token from localStorage
  const { user, token } = isAuthenticated();
  const { productId } = useParams();

  const {
    name,
    description,
    price,
    quantity,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData,
  } = values;

  const init = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        // populate the state
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          shipping: data.shipping,
          quantity: data.quantity,
          formData: new FormData(),
        });
        // load categories
        initCategories();
      }
    });
  };

  // load categories and set from data.error
  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
        });
      } else {
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    init(productId);
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
    updateProduct(productId, user._id, token, formData).then((data) => {
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
          redirectToProfile: true,
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
      <button className="btn btn-outline-primary">Update Product</button>
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
      <h2>{`${createdProduct}`} is updated!</h2>
    </div>
  );

  const showLoading = () => {
    loading && (
      <div className="alert alert-success">
        <h2>Loading...</h2>
      </div>
    );
  };

  const redirectUser = () => {
    if (redirectToProfile) {
      if (!error) {
        return <Navigate to="/" />;
      }
    }
  };

  return (
    <Layout
      title="Update the product"
      description={`G'day ${user.name}, ready update the product?`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newProductForm()}
          {redirectUser()}
        </div>
      </div>
    </Layout>
  );
}
