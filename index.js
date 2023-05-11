const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


// tuhin153695
// c3cdhm8GbYtAzPYE




const uri = "mongodb+srv://tuhin153695:c3cdhm8GbYtAzPYE@cluster0.weuf9zh.mongodb.net/?retryWrites=true&w=majority";

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

    const database = client.db("userDB");
    const userCollection = database.collection("user");

    app.get('/users', async (req, res) => {
        const cursor = userCollection.find()
        const result = await cursor.toArray()
        res.send(result);

    })


    app.get('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const user = await userCollection.findOne(query);
        res.send(user);
    })



    app.post('/users', async(req, res) => {
        const user = req.body;
        console.log('new user', user);
        const result = await userCollection.insertOne(user);
        res.send(result);

    })


    app.put('/users/:id', async(req, res) => {
        const id = req.params.id;
        const user = req.body;
        console.log(id, updatedUser);
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updatedUser = {
            $set: {
                name: user.name,
                email: user.email
            }
        }

        const result = await userCollection.updateOne(filter, updatedUser, options)
        res.send(result);
    })




    app.delete('/users/:id', async(req, res) => {
        const id = req.params.id;
        console.log('Please delete from database', id);

        const query = {_id: new ObjectId(id)};
        const result = await  userCollection.deleteOne(query);
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Simple CRUD id running');
})


app.listen(port, (req, res) => {
    console.log(`Simple CRUD is running on port: ${port}`);
})