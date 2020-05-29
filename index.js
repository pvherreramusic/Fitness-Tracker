// OUR MAIN SERVER

const express = require('express'); 
const PORT  = process.env.PORT || 3000;
const app = express();
const chalk = require('chalk');



//>>>>>>>>>>>>>>>>>>>UNABLE TO CONNECT TO THE CLIENT HERE.............
//>>>>>>>>>>>>>>>>>>> CLIENT VARIABLE IS REQUIRED FROM POSTGRES IN DB FOLDER 

// const { client } = require('./db');
// client.connect();




app.listen( PORT, () => {
    console.log(chalk.blue(`Server is listening on PORT:${ PORT }`));

});

// const apiRouter = require('./api');
// app.use('/api', apiRouter);