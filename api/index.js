const express = require('express');
const apiRouter = express.Router();
const { getUserById } = require('../db/users.js')


apiRouter.use((req,res,next)=>{
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { 
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
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

const routineActivitiesRouter = require('./routine_activities');
apiRouter.use('./routine_activities',routineActivitiesRouter);


apiRouter.use((error, res) => {
    res.send(error);
  });

module.exports = apiRouter;