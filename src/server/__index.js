const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://eco_yousuf:RafH1yMDa481onIL@ecommerceapp.15pgh.mongodb.net/?retryWrites=true&w=majority&appName=ecommerceApp";

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
      // Connect the client to the server
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");

      const database = client.db("users");
      const sliderCollection = database.collection("slide");

      app.get("/slider", async (req, res) => {
         try {
            const slider = await sliderCollection.find({}).toArray();
            res.send(slider);
         } catch (error) {
            console.error("Slider error is:", error);
            res.status(500).send({ error: "An error occurred while fetching the slider data." });
         }
      });

      // Start the server after connecting to MongoDB
      app.listen(port, () => {
         console.log(`Server is running on port ${port}`);
      });

   } catch (error) {
      console.error("Error connecting to MongoDB:", error);
   }
}

run().catch(console.dir);