/* eslint-disable import/no-anonymous-default-export */
import http from "k6/http";
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";
// import {
//   randomItem,
//   randomIntBetween,
// } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
// import { sleep } from "k6";

export default function () {
  const url = "http://0.0.0.0:3000";

  const params = {
    headers: {
      "X-Targeting-Key": uuidv4(),
    },
  };
  http.get(`${url}/api/products`, params);
}
