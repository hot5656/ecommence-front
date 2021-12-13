// ./src/core/Shop.js
import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCategories, getFilteredProducts } from "./apiCore";
import Checkbox from "./Checkbox";
import Radiobox from "./Radiobox";
import { prices } from "./fixPrices";

export default function Shop() {
  const [categories, setCategories] = useState([]);
  const [myFilters, setMyFilters] = useState({
    filters: {
      category: [],
      price: [],
    },
  });
  const [error, setError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filteredResult, setFilteredResult] = useState([]);

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        // FormData 可建立表單資料中的欄位/值建立相對應的的鍵/值對（key/value）集合
        setCategories(data);
      }
    });
  };

  function loaderFilterResults(newFilters) {
    // console.log(newFilters);
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      // console.log(data);
      if (data.error) {
        setError(data.error);
        setFilteredResult([]);
      } else {
        setFilteredResult(data.data);
        setSize(data.size);
        setSkip(0);
      }
    });
  }

  function loadMore() {
    let toSkip = skip + limit;
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      // console.log(data);
      if (data.error) {
        setError(data.error);
        setFilteredResult([]);
      } else {
        setFilteredResult([...filteredResult, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  }

  function loadMoreButton() {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-warning mb-5">
          Load more
        </button>
      )
    );
  }

  useEffect(() => {
    init();
    loaderFilterResults(myFilters.filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilters = (filters, filterBy) => {
    // console.log("Shop", filters, filterBy);
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy === "price") {
      let priceValue = handlePrice(filters);
      newFilters.filters[filterBy] = priceValue;
    }
    loaderFilterResults(myFilters.filters);
    setMyFilters(newFilters);
  };

  function handlePrice(value) {
    const data = prices;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  }

  const showError = () => {
    if (error) {
      return <h3 className="text-danger">Category should be unique</h3>;
    }
  };

  // console.log(filteredResult);
  return (
    <Layout
      title="Shop Page"
      description="Search and find books of your choice"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-4">
          <h4>Fillter by categories</h4>
          <ul>
            <Checkbox
              categories={categories}
              handleFilters={(filters) => handleFilters(filters, "category")}
            />
          </ul>
          <h4>Fillter by price range</h4>
          <div>
            <Radiobox
              prices={prices}
              handleFilters={(filters) => handleFilters(filters, "price")}
            />
          </div>
        </div>
        <div className="col-8">
          {showError()}
          <h2 className="mb-4">Products</h2>
          <div className="row">
            {filteredResult.map((product, i) => (
              <div key={i} className="col-4 mb-3">
                <Card product={product} />
              </div>
              // <Card key={i} product={product}></Card>
            ))}
          </div>
          <hr />
          {loadMoreButton()}
        </div>
      </div>
    </Layout>
  );
}
