const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware is here

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h2th6lu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productsCollection = client
      .db("educational-toy-garden")
      .collection("products");

    app.post("/myProducts", async (req, res) => {
      const myToys = productsCollection.find({ seller_email: req.body.email });
      const result = await myToys.toArray();
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newToy = req.body;
      console.log(newToy);
      const result = await productsCollection.insertOne(newToy);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await productsCollection.findOne(query);
      res.send(result);
    });
    // update is here
    app.patch("/product/:id", async (req, res) => {
      const id = req.params.id;
      console.log(req.body);
      console.log(id);
      const query = { _id: new ObjectId(id) };

      const result = await productsCollection.updateOne(query, {
        $set: req.body,
      });
      res.send(result);
    });

    // Delete is here
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("educational toy garden server is running");
});

app.listen(port, () => {
  console.log(`educational toy garden server is running on port ${port}`);
});
