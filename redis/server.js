// start the server: npm run start

const cors = require("cors");
const express = require("express");
const redis = require("redis");
const axios = require("axios");

const orders = require("./api/routes/order.js");

// call the express function which create the express applicaton
// this allows us to use the full functionality of our express application
const app = express();
const port = 3000;
// const client = redis.createClient();

// apply our application level middleware
app.use(cors());
app.use(express.json());

// create a get route for our default route localhost:8888
app.get("/", async (req, res) => {
  res.send("Welcome to CS5220 Midtern Redis Demo App");
});

// use the prefix /orders
// add the orders router to the express application
app.use("/orders", orders);

// // start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
