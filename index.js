const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ykgi9mv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
        // await client.connect();

        const database = client.db('touristsDB')
        const touristsCollection = database.collection("tourists");

        const userCollection = client.db('touristsDB').collection("users");
        const extraCollection = client.db('touristsDB').collection("ExtraData");

        // extraCollection
        app.get('/country_Name', async (req, res) => {
            const categories = await extraCollection.find({}).toArray();
            res.send(categories);
        });

        app.get('/country_Name/:countryName', async (req, res) => {
            const subcategory = req.params.countryName;
            const products = await extraCollection.find({ countryName: subcategory }).toArray();
            res.send(products);
        });
        app.get('/country/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId.createFromHexString(id) };
            const result = await extraCollection.findOne(query);
            res.send(result);
        });
        // userCollection
        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log('new user ', user)
            const result = await userCollection.insertOne(user);
            res.send(result)
        });

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        });


        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId.createFromHexString(id) }
            const user = await touristsCollection.findOne(quary)
            res.send(user)
        });
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId.createFromHexString(id) }
            const options = { upsert: true }
            const updatedTourist = req.body
            const tourists = {
                $set: {
                    userName: updatedTourist.userName,
                    spotName: updatedTourist.spotName,
                    countryName: updatedTourist.countryName,
                    description: updatedTourist.description,
                    averageCost: updatedTourist.averageCost,
                    travelTime: updatedTourist.travelTime,
                    image: updatedTourist.image,
                    seasonality: updatedTourist.seasonality,
                    countryName: updatedTourist.countryName,
                    location: updatedTourist.location,
                    totalVisitorsPerYear: updatedTourist.totalVisitorsPerYear
                }
            }
            const result = await touristsCollection.updateOne(filter, tourists, options)
            res.send(result)
        });

        app.delete("/user/:id", async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId.createFromHexString(id) };
            const result = await touristsCollection.deleteOne(quary);
            res.send(result)

        })

        app.post('/tourists', async (req, res) => {
            const user = req.body;
            console.log('new user ', user)
            const result = await touristsCollection.insertOne(user);
            res.send(result)
        })

        app.get('/tourists', async (req, res) => {
            const cursor = touristsCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get('/tourists/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId.createFromHexString(id) }
            const user = await touristsCollection.findOne(quary)
            res.send(user)
        });

        app.get('/user/email/:email', async (req, res) => {
            const email = req.params.email;
            const data = await touristsCollection.find({ email: email }).toArray();
            res.send(data);
        });

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
    res.send('tourists making server is running');
});

app.listen(port, () => {
    console.log(`tourists server is running on port: ${port}`);
});
