const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');


const app = express();
const jwt = require('jsonwebtoken');

const salt = bcrypt.genSaltSync(10);
const secret = "abc"

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://blog:3i7QUIJSE8uB54S6@cluster0.r7g2hbm.mongodb.net/?retryWrites=true&w=majority')

app.post('/register', async (req, res) => {
  console.log('register')
  const { username, password } = req.body;
    const userDoc = await User.create({ username, password: bcrypt.hashSync(password, salt), });
    // res.json({ requestData: { username, password } });
    res.json(userDoc);
});

app.post('/login', async (req, res) => {
  // console.log('login')
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username: username })
  const passOk = bcrypt.compareSync(password, userDoc.password);
  // console.log('3', passOk)
  if (passOk) {
    //logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});


app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  console.log('tokenin profile', token)
  // if (token) {
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    }); //arguments are string, secret and options, then a callback
  // }
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
})

app.post('/post', uploadMiddleware.single('file'), (req, res) => {
  // res.json({ files: req.file });
  const { originalname } = req.file;
  const parts = originalname.split('.')
  const ext = parts[parts.length - 1]
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);
  res.json({ ext });
})

app.listen(4000);
// 3i7QUIJSE8uB54S6

// mongodb+srv://blog:3i7QUIJSE8uB54S6@cluster0.r7g2hbm.mongodb.net/?retryWrites=true&w=majority