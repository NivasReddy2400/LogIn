const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const port =3000;

// connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/login', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //useCreateIndex: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log('Error connecting to MongoDB', error);
});

// define user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// create user model
const User = mongoose.model('User', userSchema);

// set up session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// parse request body
app.use(express.urlencoded({ extended: true }));

// serve static files
app.use(express.static('public'));

// serve login page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

// serve register page
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/views/register.html');
});

// handle register form submission
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create new user
  const user = new User({
    email,
    password: hashedPassword
  });

  try {
    await user.save();
    req.session.user = user;
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    res.redirect('/register');
  }
});

// handle login form submission
app.post('/', async (req, res) => {
  const { email, password } = req.body;

  // find user by email
  const user = await User.findOne({ email });

  if (user) {
    // compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.user = user;
      res.redirect('/dashboard');
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
});

// handle logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// start server
app.listen(3000, () => {
  console.log(`Server started on port 3000`);
});
