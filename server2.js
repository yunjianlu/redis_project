const express = require("express")
const axios = require("axios")
const cors = require("cors")
const redis = require("redis")
const app = express()
app.use(cors())

let redisClient;

(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => console.error(`Error : ${error}`));
  await redisClient.connect();
})();


async function fetchApiData() {
    const apiResponse = await axios.get(
        `https://jsonplaceholder.typicode.com/photos`
      );
    console.log("Request sent to the API");
    return apiResponse.data;
  }

  async function heavy_compute() {
    const dataset =  require("../taskApp/api/mock_data/rides2.json")
    // sum represnets a heavy computation job, like AI training or data analytics 
    sum = 0
    for(i=2;i<10000000; i++){sum = sum + i*i/(i-1)}
    console.log(sum)
    return dataset;
  }


app.get("/photos", async(req, res)=>{
    let results;
    try {
        const cacheResults = await redisClient.get("photos");
        if (cacheResults) {
            console.log("cached")
            results = JSON.parse(cacheResults);
        }else{
            results = await heavy_compute()
            // results = await fetchApiData();
            await redisClient.set("photos", JSON.stringify(results));
        }
        
        res.json(results)
    }
    catch (error) {
        console.error(error);
        res.status(404).send("Data unavailable");
      }
})

console.log("port 8888 running")
app.listen(8888)