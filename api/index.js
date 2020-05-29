//These should be our routers
const express = require('express');
const apiRouter = express.Router();



const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const routinesRouter = require('./routines');
apiRouter.use('/routines', routinesRouter);

const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter);



apiRouter.use((error, req, res, next) => {
    res.send(error);
  });



  



module.exports = apiRouter, usersRouter, routinesRouter, activitiesRouter;