const router = require("express").Router();
const redis = require("redis");
const axios = require("axios");

// require in our mock data to support our API responses
const orders = require("../../../mock_data/orders.json");
//const client = redis.createClient();

const DEFAULT_EXPIRATION = 3600;

router.get("/time", async (req, res) => {
  try {
    await client.connect();
    const serverTime = await client.time();
    console.log(serverTime);
    res.json({ time: serverTime });
    await client.quit();
  } catch (error) {
    console.log(error);
  }
});

router.get("/acl", async (req, res) => {
  try {
    const client = redis.createClient({
      url: "redis://alan:alanpassword@127.0.0.1:6379",
    });
    await client.connect();
    if (!(await client.get("order_detail"))) {
      await client.set("order_detail", JSON.stringify(orders), { EX: 3600 });
    }
    res.json({ order: await client.get("order_detail") });
    // This will error as this user is not allowed to run this command...
    console.log(
      `Response from GET command: ${await client.get("order_detail")}`
    );

    await client.quit();
  } catch (error) {
    console.log(`GET command failed: ${error.message}`);
  }
});

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
