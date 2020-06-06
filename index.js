// OUR MAIN SERVER
require('dotenv').config();

const { PORT = 3000 } = process.env;
const express = require('express');
const server = express();
const apiRouter = require('./api/index.js');

const { client } = require('./db/client');
client.connect();

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});

server.use('/api', apiRouter);