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

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log('new user ', user)
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const user = await userCollection.findOne(quary)
            res.send(user)
        });
        app.delete("/user/:id", async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(quary);
            res.send(result)

        })
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
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
                    totalVisitorsPerYear: updatedTourist.totalVisitorsPerYear
                }
            }
            const result = await userCollection.updateOne(filter, tourists, options)
            res.send(result)
        });

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
            const quary = { _id: new ObjectId(id) }
            const user = await touristsCollection.findOne(quary)
            res.send(user)
        });
        app.post('/extra', async (req, res) => {
            const user = req.body;
            console.log('new user ', user)
            const result = await extraCollection.insertOne(user);
            res.send(result)
        })

        app.get('/extra', async (req, res) => {
            const cursor = extraCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get('/extra/country_Name', async (req, res) => {
            try {
                const countryName = req.query.country_Name; 
                const cursor = extraCollection.find({ country_Name: countryName });
                const result = await cursor.toArray();
                res.json(result); 
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
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
