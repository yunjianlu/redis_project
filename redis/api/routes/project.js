const router = require("express").Router();
const redis = require("redis");
const axios = require("axios");

// require in our mock data to support our API responses
const projects = require("../../../mock_data/projects.json");
const client = redis.createClient();

const DEFAULT_EXPIRATION = 3600;

router.get("/", async (req, res) => {
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

// POST /projects
router.post("/", (req, res) => {
  console.log("post");
});

//GET /projects/:id
router.get("/:id", (req, res) => {
  client.get("project", (error, element) => {
    if (error) {
      console.log(error);
    }
    if (element != null) {
      return res.json(JSON.parse(element));
    } else {
      const { params } = req;
      const { id } = params;

      let project = null;

      projects.filter((element) => {
        return element.id === id;
      });

      if (project !== null) {
        client.setEx("project", DEFAULT_EXPIRATION, JSON.stringify(project));
      }
    }
  });
});

// router.get("/photos", async (req, res) => {
//   const albumId = req.query.albumId;
//   const { data } = await axios.get(
//     "https://jsonplaceholder.typicode.com/photos",
//     { parms: { albumId } }
//   );
//   client.setex("photos", 3600, JSON.stringify(data));

//   res.json(data);
// });

//PUT /projects/:id
router.put("/:id", (req, res) => {
  console.log("update by id");
});

module.exports = router;
