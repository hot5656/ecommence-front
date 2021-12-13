// ./src/auth/index.js
import { API } from "../config";

export const signup = (user) => {
  // 要加 return 才能 then 處理
  return (
    fetch(`${API}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      // json format body 傳回要加 .json()
      .then((response) => response.json())
      // then 處理, 若有 check data 要加 retuen
      .then((data) => {
        // console.log("data:", data);
        return data;
      })
      .catch((err) => {
        console.log("signup err:", err);
        return { error: "Server not response" };
      })
  );
};

export const signin = (user) => {
  // 要加 return 才能 then 處理
  return (
    fetch(`${API}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      // json format body 傳回要加 .json()
      .then((response) => response.json())
      // then 處理, 若有 check data 要加 retuen
      // .then((data) => {
      //   console.log("data:", data);
      //   return data;
      // })
      .catch((err) => {
        console.log("signup err:", err);
        return { error: "Server not response" };
      })
  );
};

export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

export const signout = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    next();
    fetch(`${API}/signout`, {
      method: "GET",
    })
      // json format body 傳回要加 .json()
      .then((response) => response.json())
      // .then((response) => {
      //   console.log("signout", response);
      // })
      .catch((err) => {
        console.log(err);
        return { error: "Server not response" };
      });
  }
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};
