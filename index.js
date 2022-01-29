const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qi74p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('your_highway')
        const blogsCollection = database.collection('blogs');

        // make blogs by POST API
        app.post('/blogs', async (req, res) => {
            const newBlog = req.body;
            const result = await blogsCollection.insertOne(newBlog);
            res.send(result);
        });



    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("running the CRUD server");
});

app.listen(port, () => {
    console.log("Running server on port ", port);
})