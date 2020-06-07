const { client } = require('./client')

async function createUser({ 
    username, 
    password
  }) {
    try {
      const { rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password) 
        VALUES($1, $2) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password]);
  
      return user;
    } catch (error) {
      throw error;
    }
};

async function getUsers() {
  try {
    const { rows } = await client.query(`
      SELECT username
      FROM users;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
};
  

async function createInitialUsers(){
  try {
    await createUser({ 
      username: 'Calebtherock', 
      password: 'therock941',
    });
    await createUser({ 
      username: 'PatrickStar', 
      password: 'underarock',
    });
  } catch(error){
      console.log('Error creating users!')
      throw error}
};

function requireUser(req, res, next) {
  if(!req.user) {
      next({
          name: "MissingUserError",
          message: "You must be logged in to perform this action"
      });
  }
  next();
}

async function getUserById(id){
  try{ 
    const { rows:[ user ] } = await client.query(
      `SELECT username
      FROM users
      WHERE id=${ id }`
    ) ;

    if (!user){ 
      return null
    } 
    delete user.password
    return user
}catch(error){
  throw error

}}

async function getUserByUsername(username){
  try{ 
    const { rows:[ user ] } = await client.query(
      `SELECT username
      FROM users
      WHERE username=${ username }`
    ) ;

    if (!user){ 
      return null
    } 

    return user
}catch(error){
  throw error

}}

async function getUserByRoutineId(routineId){
  try{ 
    const {rows:[routines]} = await client.query(
      `SELECT name
       FROM routines
       WHERE id = ${ routineId}`
    );

    const { rows:[ user ] } = await client.query(
      `SELECT username
      FROM users
      WHERE id=${ routines.creatorId }`
    ) ;
    if (!user){ 
      return null
    } 
    return user
}catch(error){
  throw error

}}
    

module.exports = {
    createUser, getUsers, createInitialUsers, requireUser, getUserById, getUserByUsername, getUserByRoutineId
}