// ./src/core/Product.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import { read, listRelated } from "./apiCore";
import Card from "./Card";

export default function Product(props) {
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [error, SetError] = useState("");
  const params = useParams();

  if (error) {
    console.log(error);
  }

  // console.log(props);
  function locaSingleProduct(productId) {
    read(productId).then((data) => {
      if (data.error) {
        SetError(data.error);
      } else {
        setProduct(data);
        // fetch related products
        listRelated(data._id).then((data) => {
          if (data.error) {
            SetError(data.error);
          } else {
            setRelatedProduct(data);
          }
        });
      }
    });
  }

  useEffect(() => {
    // react-router-dom v6 get parameter
    const productId = params.productId;
    locaSingleProduct(productId);
  }, [params]);

  return (
    <Layout
      title={product && product.name}
      description={
        product && product.description && product.description.substring(0.1)
      }
      className="container-fluid"
    >
      <div className="row">
        <div className="col-8">
          {product && product.description && (
            <Card product={product} showViewProductButton={false} />
          )}
        </div>
        <div className="col-4">
          <h4>Rekated Products</h4>
          {relatedProduct.map((p, i) => (
            <div className="mb-3">
              <Card key={i} product={p} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
