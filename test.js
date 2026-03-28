import autocannon from "autocannon";
import fs from "fs";

const body = fs.readFileSync("./body.json", "utf-8");

autocannon(
  {
    url: "http://localhost:3000/api/stock/movement",
    connections: 3,
    duration: 15,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  },
  console.log,
);
