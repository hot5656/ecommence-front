// ./src/core/Layout.js
/* eslint-disable react/prop-types */
import React from "react";
import Menu from "./Menu";
import "../styles.css";

export default function Layout({
  title = "Title",
  description = "Destription",
  className,
  children,
}) {
  // console.log("Layout render...");
  return (
    <div>
      <Menu />
      <div className="jumbotron">
        <h2>{title}</h2>
        <p className="lead">{description}</p>
      </div>
      <div className={className}>{children}</div>
    </div>
  );
}
