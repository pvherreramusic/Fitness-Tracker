//These should be our routers
const express = require('express');
const apiRouter = express.Router();



apiRouter.use((req,res,next)=>{
  //check for authorization somehow here. that would set the req.user
  //this will only need to be for the logged in functions
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
});



const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const routinesRouter = require('./routines');
apiRouter.use('/routines', routinesRouter);

const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter);




apiRouter.use((error, req, res, next) => {
    res.send(error);
  });







module.exports = apiRouter;