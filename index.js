const express = require('express');
const path = require('node:path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express()

mongoose.connect('mongodb://127.0.0.1')
.then(data => console.log('sucess'))
.catch(err => console.log('errrrrr'))

const sessionStore = new MongoStore({
  mongoUrl:'mongodb://127.0.0.1/Users',
  mongooseConnection:mongoose.connection,
  collection:'session',
})

//app.set('views')
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'likjhsdbfgoiwg8yilkj9384yhfg;',
  resave:false,
  saveUninitialized:true,
  store:sessionStore,
  cookie:{
    maxAge:86400000
  }
}))

app.get('/',(req,res)=>{
  console.log(__dirname + "/views/html")
  res.sendFile('public/index1.html' , { root : __dirname})
  res.sendStatus(200);
})

















































app.listen(3000,()=>console.log('on 3000'))