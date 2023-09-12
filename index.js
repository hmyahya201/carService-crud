const e = require("express");
const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;
const cors = require("cors")

app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p43vn94.mongodb.net/?retryWrites=true&w=majority`;

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
    const serviceSollection = client.db("carServices").collection("allservice")
    const bookinkgCollection = client.db("carServices").collection("bookings")

    app.get("/service", async(req, res)=>{
      const result = await serviceSollection.find().toArray()
      res.send(result)
    })
//forCheckout
    app.get('/service/:id', async(req, res)=>{
      const id = req.params.id
      const query =  { _id: new ObjectId(id)};

      const option = {
         projection: {title:1, price:1, img:1, service_id:1}
      }
      const result = await serviceSollection.findOne(query, option)
      res.send(result)
      console.log(id)
    })

   //orderConfirm

   app.post('/bookings', async(req, res)=>{
      const booking = req.body
      console.log(booking)
      const result = await bookinkgCollection.insertOne(booking)
      res.send(result)
   })

   app.get('/bookings', async(req, res)=>{
      if(req.query?.email){
         query = {email: req.query.email}
      }
      const result = await bookinkgCollection.find(query).toArray()
      res.send(result)

   })

   app.delete('/bookings/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await bookinkgCollection.deleteOne(query)
      res.send(result)

   })


   app.patch('/bookings/:id', async(req, res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const updateBook = req.body

      const upDateDoc = {
         $set:{status: updateBook.status}
      }
      const result = await bookinkgCollection.updateOne(filter, upDateDoc)
      res.send(result)
   })
   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);






app.get('/', (req, res)=>{
   res.send("The server is running")
})

app.listen(port, (req, res)=>{
   console.log(`the server is running on ${port} port`)
})