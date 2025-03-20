const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const app = express();
const port = 3010;

const User = require('./schema.js');

app.use(express.json())
app.use(express.static('static'));
require('dotenv').config();
const uri = process.env.uri;


mongoose.connect(uri)
.then(()=>{
  console.log("Database connected successfully!")
})
.catch((err)=>console.log(err));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/users',async(req,res)=>{
  try{
    const data = await User.find({});
  return res.json(data);
  }
  catch(err){
    res.status(500).json({
      mess: err.message
    })
  }
})

app.post('/users',async(req,res)=>{
  try{const {username,email,password} = req.body;

  if(!username || !email || !password){
    return  res.status(404).json({message:"Data missing"});
  };
  const saltRounds = 10;
  const hashedPass = await bcrypt.hash(password,saltRounds)
  const newData = await User.create({username,email,password:hashedPass});
  return res.status(201).json({ message: "User created successfully!", user: newData });
  }
  catch(err){
    res.status(500).json({err:err})
  }  

})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
