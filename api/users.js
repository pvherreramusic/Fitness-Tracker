const express = require('express');
const bcrypt = require('bcrypt');
const usersRouter = express.Router();
const { getUsers, createUser } = require('../db');

usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    const SALT_COUNT = 10;

bcrypt.hash(password, SALT_COUNT, function(err, hashedPassword) {
  createUser({
    username,
    password: hashedPassword // not the plaintext
  });
});

usersRouter.post('/login', async (req, res, next) => {
const { username, password } = req.body;
const user = await getUsers(username);
const hashedPassword = user.password;

bcrypt.compare(password, hashedPassword, function(err, passwordsMatch) {
  if (passwordsMatch) {
    
  } else {
    throw SomeError;
  }
});

})
});
module.exports = usersRouter;