
const express = require('express'); 
const PORT  = process.env.PORT || 3000;
const app = express();
const chalk = require('chalk');
const { Client } = require('pg');
const connectionString = 'postgres://localhost:5432/fitness-dev';
const client = new Client(connectionString)


module.exports = {
    client
}