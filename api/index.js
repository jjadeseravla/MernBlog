const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
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
app.use('/uploads', express.static(__dirname + '/uploads')); // needed this line to get images to render

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

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  // res.json({ files: req.file });
  const { originalname, path } = req.file;
  const parts = originalname.split('.')
  const ext = parts[parts.length - 1]
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    console.log('info-----------------', info);
    if (err) throw error;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
    // console.log('postdoc-----------------', res.json(postDoc));
  });
})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  // check if we have a file
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);

    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);  // is token the same as the author of this
  
    if (!isAuthor) {
      return res.status(400).json('you\re not the author');
      // throw 'you\'re not the author'
    }
  
        // Update the document properties directly
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        postDoc.cover = newPath ? newPath : postDoc.cover;
    
        // Save the changes to the database
        await postDoc.save();
    // await postDoc.update({
    //   title, // put all the info from the req.body
    //   summary,
    //   content,
    //   cover: newPath ? newPath : postDoc.cover, // update only if we have a new path
    // });
    res.json(postDoc);
  });
});

app.get('/post', async (req, res) => {
  res.json(
    await Post.find()
    .populate('author', ['username'])
    .sort({ createdAt: -1 }) // latest post on top
    .limit(20)
  )
});

app.get('/post/:id', async (req, res) => {
  // res.json(
  //   await Post.find({ _id: req.params.id})
  // )
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc)
  // res.json({ test: 'test' })
})

app.listen(4000);
// 3i7QUIJSE8uB54S6

// mongodb+srv://blog:3i7QUIJSE8uB54S6@cluster0.r7g2hbm.mongodb.net/?retryWrites=true&w=majority