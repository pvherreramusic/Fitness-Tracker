const express = require('express'); 
const PORT  = process.env.PORT || 3000;
const app = express();
const chalk = require('chalk');

// const { client } = require('./db');
// client.connect();




app.listen( PORT, () => {
    console.log(chalk.blue(`Server is listening on PORT:${ PORT }`));

});