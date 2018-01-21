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
import Mailer from './services/Mailer';

// bootstrap
import {db} from './bootstrap/db';
import {routerMiddleWare, routerParser} from './bootstrap/routerHelper';
import authentication from './routes/authentication';

// getting port
let port = process.env.PORT || '4000';
let dbPromise = db();

dbPromise.then((db) => {
  console.log("DB Connected..");
});

// making server
let app = express();
const server = http.createServer(app);
// initializing socket
const io = socketIo(server, {log: true, origins:'*:*'});

let props = {app, io, dbPromise};

routerMiddleWare(props); // set cross origin headers
routerParser(props); // parse router params, queryparams
authentication(props); // contains auth related functions

io.on('connection', socket => {
  console.log('socket connected');

  socket.on('CONNECT', (data) => {
    socket.emit('CONNECT', 'connected');
  });

  // end
  socket.on("disconnect", () => console.log("Client disconnected"));
});


server.listen(port, () => console.log(`Listening on port ${port}`));
