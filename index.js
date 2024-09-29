const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // This allows parsing JSON from request body





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@basicsexploring.cgr22.mongodb.net/?retryWrites=true&w=majority&appName=basicsExploring`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);

// Start the Express server
app.get("/", (req, res) => {
  res.send("Digital Insights Server is Running");
});

app.listen(port, () => {
  console.log(`Digital Insights Server is listening on ${port}`);
});