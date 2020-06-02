const express = require('express');
const bcrypt = require('bcrypt');
const usersRouter = express.Router();
const { getUsers, createUser } = require('../db');

usersRouter.use((next)=>{
    console.log('A request is being made to the users router!');
    next();
});


usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  const SALT_COUNT = 10;
  try{
  bcrypt.hash(password, SALT_COUNT, function(err, hashedPassword) {
    const newUser = await createUser({
      username,
      password: hashedPassword // not the plaintext
    });
    console.log('Thanks for signing up!')
    res.send(newUser); 
  });
  }catch(error){
      console.error(error)
};
});

//need to add a JWT 
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const user = await getUser(username, password);
  const hashedPassword = user.password;

  bcrypt.compare(password, hashedPassword, function(err, passwordsMatch) {
    if (passwordsMatch) {
      
    } else {
      throw err("Not working, dum dum", err);
    }
    });
});

usersRouter.get('/:username/routines', async ( res ) => {
  const userRoutines = await getPublicRoutinesByUser();
  res.send({
    userRoutines
  });
});

module.exports = usersRouter;