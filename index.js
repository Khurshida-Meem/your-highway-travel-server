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
        const database = client.db('Your-Highway')
        const placeCollection = database.collection('destination');
        const reviewsCollection = database.collection("reviews");
        const blogsCollection = database.collection("blogs");
        const usersCollection = database.collection("users");


        // make places by POST API
        app.post('/places', async (req, res) => {
            const newPlace = req.body;
            const result = await placeCollection.insertOne(newPlace);
            res.send(result);
        });

        // GET places API
        app.get('/places', async (req, res) => {
            const cursor = placeCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        });

        // GET dynamic API
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const places = await placeCollection.findOne(query);
            res.send(places);
        });

        // delete order by id under one email
        app.delete('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await placeCollection.deleteOne(query);
            res.json(result);
        });

        // make blogs by POST API
        app.post('/reviews', async (req, res) => {
            const newReview = req.body;
            const result = await reviewsCollection.insertOne(newReview);
            res.send(result);
        });

        // GET products API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // GET dynamic API
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const reviews = await reviewsCollection.findOne(query);
            res.send(reviews);
        });

        // GET reviews by email
        app.post('/reviews/byEmail', async (req, res) => {
            const email = req.body;
            const query = { email: { $in: email } }
            const review = await reviewsCollection.find(query).toArray();
            res.send(review);
        });
        // delete review by id under one email
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.json(result);
        });

        // make blogs by POST API
        app.post('/blogs', async (req, res) => {
            const newBlog = req.body;
            const result = await blogsCollection.insertOne(newBlog);
            res.send(result);
        });

        // GET blogs API
        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        });

        // GET dynamic API
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const blogs = await blogsCollection.findOne(query);
            res.send(blogs);
        });

        // GET blogs by email
        app.post('/blogs/byEmail', async (req, res) => {
            const email = req.body;
            const query = { email: { $in: email } }
            const blogs = await blogsCollection.find(query).toArray();
            res.send(blogs);
        });
        // delete blogs by id under one email
        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogsCollection.deleteOne(query);
            res.json(result);
        });

        // UPDATE API
        app.put('/blogs/:id', async (req, res) => {
            const blog = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: blog.status
                }
            };
            const result = await blogsCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        })

        // get admin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        // POST API to save user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        // GET users
        // app.get('/users', async (req, res) => {
        //     const cursor = usersCollection.find({});
        //     const users = await cursor.toArray();
        //     res.send(users);
        // });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const option = { upsert: true };
            const updateUser = { $set: user };
            const result = await usersCollection.updateOne(filter, updateUser, option);
            res.send(result);
        });

        // make admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
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