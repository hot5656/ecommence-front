// ./src/core/cartHelpers.js
export function addItem(item, next) {
  let cart = [];

  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
  }
  cart.push({
    ...item,
    count: 1,
  });
  // console.log(cart);

  // remove duplicates
  // build an Array from new Set and turn it back into array using Array.format
  // so that later we ca re-map it
  // new set will only allow unique value in it
  // so pass the ids of each object/product
  // if the loop tries to add the same value again, it'ii get ignored
  // ...with the array of ids  we got on when first map() was used
  // run map on it again and return the actual product from the cart

  // // Array.from() 方法會從類陣列（array-like）或是可迭代（iterable）物件建立一個新的 Array 實體
  // cart = Array.from(
  //   // Set 可以視為一個 values 的收集器，每個值只會出現一次而已
  //   new Set(
  //     cart
  //       .map((p, i) => {
  //         console.log("p1:", i, p._id);
  //         return p._id;
  //       })
  //       .map((id, i2) => {
  //         console.log("p2:", i2, id);
  //         // find() 方法會回傳第一個滿足所提供之測試函式的元素值
  //         return cart.find((p, i3) => {
  //           console.log("p3:", i3, p._id, id);
  //           return p._id === id;
  //         });
  //       })
  //   )
  // );

  cart = Array.from(new Set(cart.map((p) => p._id))).map((id) => {
    return cart.find((p) => p._id === id);
  });
  // console.log(cart);

  localStorage.setItem("cart", JSON.stringify(cart));
  next();
}

export function itemTotal() {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart")).length;
    }
  }
  return 0;
}

export function getCart() {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart"));
    }
  }
  return [];
}

export function updateItem(productId, count) {
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    // eslint-disable-next-line array-callback-return
    cart.map((product, i) => {
      if (product._id === productId) {
        cart[i].count = count;
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

export function removeItem(productId) {
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    // eslint-disable-next-line array-callback-return
    cart.map((product, i) => {
      if (product._id === productId) {
        cart.splice(i, 1);
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  return cart;
}

export function emptyCart(next) {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart");
    next();
  }
}
