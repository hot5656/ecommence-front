// ./src/auth/AdminAuth.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "./index";

// 設定 TypeScript 之 type, 若不是使用 TypeScript 可以不加
// { children }: {children: JSX.Element } ==> { children }
export default function AdimnRequireAuth({ children }) {
  let location = useLocation();
  if (!isAuthenticated() || isAuthenticated().user.role !== 1) {
    console.log("not isAuthenticated");
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/signin" state={{ from: location }} />;
  }

  return children;
}
