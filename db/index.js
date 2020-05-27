const chalk = require('chalk');
const { Client } = require('pg');

const express = require('express'); 
const PORT  = process.env.PORT || 3000;
const app = express();
app.listen( PORT, () => {
    console.log(chalk.blue(`Server is listening on PORT:${ PORT }`));

});