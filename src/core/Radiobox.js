// ./src/core/Radiobox.js
/* eslint-disable array-callback-return */
import React from "react";

export default function Radiobox({ prices, handleFilters }) {
  // const [value, setValue] = useState([]);

  function handleChange(e) {
    // console.log(e.target.value);
    handleFilters(e.target.value);
    // setValue(e.target.value);
  }

  return prices.map((p, i) => (
    <div key={i} className="list-unstyled">
      <input
        name="price"
        onChange={handleChange}
        value={p._id}
        type="radio"
        className="mr-2 ml-4"
      />
      <label htmlFor="form-check-label">{p.name}</label>
    </div>
  ));
}
