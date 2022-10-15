const router = require("express").Router();
const redis = require("redis");
const axios = require("axios");

// require in our mock data to support our API responses
const orders = require("../../../mock_data/orders.json");
//const client = redis.createClient();

// Yunjian Lu (Peter)
const fetchApiData = async () => {
  const apiResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/photos`
  );
  console.log("Request sent to the API");
  return apiResponse.data;
};

const heavy_compute = async () => {
  // sum represents a heavy computation job,
  // like AI training or data analytics
  sum = 0;
  for (i = 2; i < 10000000; i++) {
    sum = sum + (i * i) / (i - 1);
  }
  console.log(sum);
  return orders;
};

router.get("/time", async (req, res) => {
  const client = redis.createClient();
  await client.connect();
  let results;

  try {
    const cacheResults = await client.get("orders");
    // If the data is in Redis, retrive it
    if (cacheResults) {
      console.log("cached");
      results = JSON.parse(cacheResults);
    }
    // If not in th Redis, go and get the data,
    // then put it into redis before respons to client
    else {
      results = await heavy_compute();
      // results = await fetchApiData();
      await client.set("orders", JSON.stringify(results));
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
});

// Andy
router.get("/acl", async (req, res) => {
  try {
    const client = redis.createClient();
    // const client = redis.createClient({
    //   url: "redis://alan:alanpassword@127.0.0.1:6379",
    // });
    await client.connect();

    // Since we only grant partial permission to authenticated user(Alan),
    // Alan has no permission to access server related operation
    // (e.g. configurate access control list) unless specified by admin user(s)
    const serverTime = await client.time();
    const users = await client.ACL_USERS();

    await client.quit();

    res.json({ server_time: serverTime, user_list: users });
  } catch (error) {
    res.status(403).send(`${error.message}`);
  }
});

// Saiyang
router.get("/script", async (req, res) => {
  const client = redis.createClient({
    scripts: {
      getKeyValue: redis.defineScript({
        NUMBER_OF_KEYS: 1,
        SCRIPT: 'return {redis.pcall("GET", KEYS[1])};',
        transformArguments(key1) {
          return [key1];
        },
      }),
    },
  });

  await client.connect();

  await client.set("Alice", "100");
  await client.set("Bob", "200");

  const sample = await client.getKeyValue("Alice");

  await client.quit();

  res.json({ result: sample });
});

module.exports = router;
