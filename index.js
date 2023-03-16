const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

mongoose.connect('mongodb://localhost:27017')
.then(data => console.log('sucess'))
.catch(err => console.log('errrrrr'))






















































application.listen(3000)