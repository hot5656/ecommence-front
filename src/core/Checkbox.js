// ./src/core/Checkbox.js
/* eslint-disable array-callback-return */
import React, { useState } from "react";

export default function Checkbox({ categories, handleFilters }) {
  const [checked, setChecked] = useState([]);

  // ***--->>> event include parameter
  const handleToggle = (c) => (e) => {
    // return the first index or -1
    const currentCategoryId = checked.indexOf(c);
    const newCheckedCategoryId = [...checked];
    // if current checked was not already in checked state > push
    // else pull/take off
    if (currentCategoryId === -1) {
      newCheckedCategoryId.push(c);
    } else {
      newCheckedCategoryId.splice(currentCategoryId, 1);
    }
    // console.log(newCheckedCategoryId);
    setChecked(newCheckedCategoryId);
    handleFilters(newCheckedCategoryId);
  };

  return categories.map((c, i) => (
    <li key={i} className="list-unstyled">
      {/* value=false -->not select  */}
      {/* ***--->>> event include parameter */}
      <input
        onChange={handleToggle(c._id)}
        value={checked.indexOf(c._id) === -1}
        type="checkbox"
        className="form-check-input"
      />
      <label htmlFor="form-check-label">{c.name}</label>
    </li>
  ));
}
