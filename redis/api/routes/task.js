const router = require("express").Router();

// require in our datetime shared function
//const datetime = require('../util/datetime');

// require in our mock data to support our API responses
const tasks = require("../../../mock_data/tasks.json");

router.get("/", (req, res) => {
  console.log("get task");
});

// POST /tasks
router.post("/", (req, res) => {
  console.log("post task");
});

//GET /tasks/:id
router.get("/:id", (req, res) => {
  console.log("get task by id");
});

//PUT /tasks/:id
router.put("/:id", (req, res) => {
  console.log("update task by id");
});

//DELETE /tasks/:id
router.delete("/:id", (req, res) => {
  console.log("delete task by id");
});

module.exports = router;
