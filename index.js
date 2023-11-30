const express = require ('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const stripe = require('stripe')('sk_test_51OEvpjD61tUFHXaWkZSreN1Nds4pAfeGHSjrmkUNCgUF9k0vvCJrCBUk2TFieK0Dfrnof4whQyEr4r1R19K6pvcW00rqcgTPOy')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//  middleware using 
app.use(cors())
app.use(express.json())

// inititalizing database 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kit4epp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run(){
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
  
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
const roomcollection = client.db('rooms').collection('room')
const roombyagreementcollection =client.db('roombyagreement').
collection('selectedrooms')
const annoucementcollection = client.db('announcement').collection('announcement')
const paymentcollection = client.db('payments').collection('payment')

app.post('/rooms',async(req,res)=>{
    const rooms = req.body
    const result = await roomcollection.insertOne(rooms)
    res.send(result)    
})
// jwt realted api 

app.post ('/JWT',async(req,res)=>{
  const user = req.body
  const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})

  res.send({token})

    
})
// stripe related api 

app.post('/create_payment_intent', async(req,res) =>{
  const {price} = req.body

   try{
    console.log(price,'price');
  const amount = parseInt(price * 100)
  console.log(amount,'amount');
 if(amount ===0 ){
  return res.json('your amount is 0 ')
 }
 else{
  const paymentIntent= await stripe.paymentIntents.create({
    amount : 750,
    currency :'usd',
    payment_method_types:["card"]
  
   });
   res.send({
    clientSecret : paymentIntent.client_secret
   })
 }

   }
  catch(error) {
    console.log(error);
  }

  

})

app.get ('/',async(req,res)=>{
    res.send('Bellford is running')
})

app.get('/rooms',async(req,res)=>{
     
    const result =  await roomcollection.find().toArray()
    res.send(result)
    
})
app.get('/roombyagreementss',async(req,res)=>{

  const result = await roombyagreementcollection.find().toArray()
  res.send(result)


})


app.patch('/roombyagreementss/:id',async(req,res)=>{
  const id = req.params.id
  const filter = {_id :new ObjectId(id)}
  const  updateddoc= {
    $set : {
      role :'user'
    }
 
  }
  const result = await roombyagreementcollection.updateOne(filter,updateddoc)
  res.send(result)

})

app.post('/roombyagreement',async(req,res)=>{
  const room =req.body
  const result = roombyagreementcollection.insertOne(room) 
  res.send(result)
})
// role update korar jonno alada route 

app.get('/roombyagreements',async(req,res)=>{
   const result = await roombyagreementcollection.find().toArray()
   res.send(result)
})

// update info 

app.patch('/roombyagreements/:id',async(req,res)=>{
  const id = req.params.id
  const filter = {_id :new ObjectId(id)}
  const  updateddoc= {
    $set : {
      status:'checked'

    }
 
  }
  const result = await roombyagreementcollection.updateOne(filter,updateddoc)
  res.send(result)

})



app.post('/announcement',async(req,res)=>{
   const announcement = req.body
   const result =  await annoucementcollection.insertOne(announcement)
   res.send(result)
})

app.get('/roombyagreement',async(req,res)=>{

  const result = await roombyagreementcollection.find().toArray()
  res.send(result)
})
app.get('/user',async(req,res)=>{
  const query = req.query.email
  const option = {email:query}
  const result = await roombyagreementcollection.findOne(option)
  res.send(result)
})
// member profile related

app.get('/memberprofile',async(req,res)=>{
  const query = req.query.email
  const option = {email: query}
  const result = await roombyagreementcollection.findOne(option)
  res.send(result)
})

// payment info related 

app.post('/paymentinfo',async(req,res)=>{
  const paymentinfo = req.body
  const result = await paymentcollection.insertOne(paymentinfo)
  res.send(result)
})

app.get('/paymentinfo',async(req,res)=>{
  const result = await paymentcollection.find().toArray()
  res.send(result)
})

app.get('/announcement',async(req,res)=>{
  const result = await annoucementcollection.find().toArray()
  res.send(result)
})

app.patch('/roombyagreement/:id',async(req,res)=>{
  const id = req.params.id
  const filter = {_id :new ObjectId(id)}
  const  updateddoc= {
    $set : {
      role :'member',
      status:'checked'

    }
 
  }
  const result = await roombyagreementcollection.updateOne(filter,updateddoc)
  res.send(result)

})

// app.listen(port,()=>{
//     console.log(`Bellford is running on port :${port}`);
// })

