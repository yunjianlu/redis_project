const router = require("express").Router();

// require in our datetime shared function
//const datetime = require('../util/datetime');

// require in our mock data to support our API responses
const users = require("../../../mock_data/users.json");

router.get("/", (req, res) => {
  console.log("get user");
});

//GET /users/:id
router.get("/:id", (req, res) => {
  console.log("get user by id");
});

//PUT /users/:id
router.put("/:id", (req, res) => {
  console.log("update user by id");
});

module.exports = router;
