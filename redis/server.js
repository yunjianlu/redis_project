// start the server: npm run start

const cors = require("cors");
const express = require("express");
const redis = require("redis");
const axios = require("axios");

const projects = require("./api/routes/project.js");
const tasks = require("./api/routes/task.js");
const users = require("./api/routes/user.js");

// call the express function which create the express applicaton
// this allows us to use the full functionality of our express application
const app = express();
const port = 3000;
const client = redis.createClient();

// apply our application level middleware
app.use(cors());
app.use(express.json());

// create a get route for our default route localhost:8888
app.get("/", async (req, res) => {
  const albumId = req.query.albumId;
  await client.connect();
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/photos",
    { parms: { albumId } }
  );
  await client.set("photos", JSON.stringify(data), { EX: 3600 });
  const value = await client.get("photos");

  res.json(value.slice(0, 82));
  //res.send("Welcome to Task Management App");
});

// use the prefix /projects
// add the projects router to the express application
app.use("/projects", projects);

// // use the prefix /tasks
// // add the tasks router to the express application
app.use("/tasks", tasks);

// // use the prefix /users
// // add the users router to the express application
app.use("/users", users);

// // start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
