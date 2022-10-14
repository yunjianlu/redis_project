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
  // const albumId = req.query.albumId;
  // await client.connect();
  // const { data } = await axios.get(
  //   "https://jsonplaceholder.typicode.com/photos",
  //   { parms: { albumId } }
  // );
  // await client.set("photos", JSON.stringify(data), { EX: 3600 });
  // const value = await client.get("photos");

  // res.json(value.slice(0, 82));

  const client = redis.createClient({
    scripts: {
      mincr: redis.defineScript({
        NUMBER_OF_KEYS: 2,
        SCRIPT:
          "return {" +
          'redis.pcall("INCRBY", KEYS[1], ARGV[1]),' +
          'redis.pcall("INCRBY", KEYS[2], ARGV[1])' +
          "}",
        transformArguments(key1, key2, increment) {
          return [key1, key2, increment.toString()];
        },
      }),
    },
  });

  await client.connect();

  await client.set("mykey", "5");
  const sample = await client.mincr("mykey", "myotherkey", 10);
  console.log(); // [ 15, 10 ]

  await client.quit();

  res.json({ result: sample });
  //res.send("Welcome to CS5220 Midtern Redis Demo App");
});

// use the prefix /orders
// add the orders router to the express application
app.use("/orders", orders);

// // start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
