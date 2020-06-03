const express = require('express');
const apiRouter = express.Router();


apiRouter.use((req,res,next)=>{
  //check for authorization somehow here. that would set the req.user
  
});

apiRouter.use((req, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
});

//Our routers for each file.
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const routinesRouter = require('./routines');
apiRouter.use('/routines', routinesRouter);

const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter);


apiRouter.use((error, res) => {
    res.send(error);
  });

module.exports = apiRouter;