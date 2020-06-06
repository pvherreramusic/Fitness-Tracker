const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const usersRouter = express.Router();
const {  createUser } = require('../db/users');

usersRouter.use(('/', (req,res, next) => {
    console.log('A request is being made to the users router!');
    next();
}));


usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  const SALT_COUNT = 10;
  try{

  bcrypt.hash(password, SALT_COUNT, function(err, hashedPassword) {
    const newUser =  createUser({
      username,
      password: hashedPassword 
    });

    const token = jwt.sign({ 
      id: newUser.id, 
      username: newUser.username
    }, process.env.JWT_SECRET, {
      expiresIn: '1w'
    });

    console.log('Thanks for signing up!')
    res.send(token); 
  });
  }catch(error){
      console.error(error)
};
});


usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }
  try{
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;

  bcrypt.compare(password, hashedPassword, function(err, passwordsMatch) {
    
    if (passwordsMatch) {
      const token=jwt.sign({ username:user.username,id:user.id }, process.env.JWT_SECRET)
        res.send({ message: "you're logged in!", token: `${ token } `});
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  });
  } catch(error) {
    console.log(error);
    next(error);
  }
});

usersRouter.get('/:username/routines', async ( req, res ) => {
  const userRoutines = await getPublicRoutinesByUser();
  res.send({
    userRoutines
  });
});

module.exports = usersRouter;