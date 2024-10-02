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
        // Connect the client to the server (optional starting in v4.7)
        
        const database = client.db("blogCollection");
        const blogCollection = database.collection("blogs");

        // Get All Blog Posts
        app.get("/blogs", async (req, res) => {
            try {
                const cursor = await blogCollection.find();
                const result = await cursor.toArray();  // Convert cursor to array
                res.status(200).json(result);  // Send the result back as JSON
            } catch (error) {
                res.status(500).json({ message: "Failed to fetch blogs", error });
            }
        });

        // Get Blog Post by ID
        app.get("/blogs/:id", async (req, res) => {
            try {
                const { id } = req.params; // Get the ID from the URL parameters
                const blog = await blogCollection.findOne({ _id: new ObjectId(id) }); // Fetch the blog using the ID

                if (!blog) {
                    return res.status(404).json({ message: "Blog not found" }); // Handle case where blog is not found
                }

                res.status(200).json(blog); // Send the blog data as JSON
            } catch (error) {
                res.status(500).json({ message: "Failed to fetch blog", error });
            }
        });

        // Delete Blog Post by ID
        app.delete("/blogs/:id", async (req, res) => {
            try {
                const { id } = req.params; // Get the ID from the URL parameters
                const result = await blogCollection.deleteOne({ _id: new ObjectId(id) }); // Delete the blog using the ID

                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: "Blog not found" }); // Handle case where blog is not found
                }

                res.status(200).json({ message: "Blog deleted successfully" }); // Success response
            } catch (error) {
                res.status(500).json({ message: "Failed to delete blog", error });
            }
        });

        // Update API
        app.put("/blogs/:id", async (req, res) => {
          const id = req.params.id;
          if (!ObjectId.isValid(id)) {
            return res.status(400).send({ error: "Invalid ObjectId" });
          }
          const filter = { _id: new ObjectId(id) };
          const options = { upsert: true };
          const updatedItem = req.body;
    
          const item = {
            $set: {
              title: updatedItem.title,
              image: updatedItem.image,
              short_description: updatedItem.short_description,
              category: updatedItem.category,
              introduction: updatedItem.introduction,
              body: updatedItem.body,
              conclusion: updatedItem.conclusion,
              publishedAt: updatedItem.publishedAt,
              user_email: updatedItem.user_email,
              author: updatedItem.author,
            },
          };
          const result = await blogCollection.updateOne(filter, item, options);
          res.send(result);
        });

        // Insert New Blog
        app.post('/blogs', async (req, res) => {
          const newBlog = req.body;
          try {
            const result = await blogCollection.insertOne(newBlog);
            res.status(201).json({ insertedId: result.insertedId });
          } catch (error) {
            console.error('Error adding blog:', error);
            res.status(500).json({ message: 'Error adding blog' });
          }
        });
    

        // await client.db("admin").command({ ping: 1 });
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
