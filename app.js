import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
import mongoose from 'mongoose';
import socketIo from 'socket.io';
import index from './routes/index';
import users from './routes/users';
//service
import Auth from './services/Auth';

require('./models');
mongoose.Promise = require('bluebird');

// getting port
let port = process.env.PORT || '3002';
const dbPromise = mongoose.createConnection('mongodb://127.0.0.1/groupie', {
  useMongoClient: true
});

dbPromise.then((db) => {
  console.log("DB Connected..");
});

// making server
let app = express();
const server = http.createServer(app);
// initializing socket
const io = socketIo(server, {log: true, origins:'*:*'});

app.use(function(req, res, next) {
    // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.header('Access-Control-Allow-Headers', 'cache-control,X-Requested-With,Content-Type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.header('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.post('/register', function(req, res) {
  const auth = new Auth(dbPromise);
  auth.register(req.body, res);
})

io.on('connection', socket => {
  console.log('socket connected');

  socket.on('CONNECT', (data) => {
    socket.emit('CONNECT', 'connected');
  });

  // end
  socket.on("disconnect", () => console.log("Client disconnected"));
});


server.listen(port, () => console.log(`Listening on port ${port}`));
