const { client } = require('./client')
const  chalk  = require('chalk')

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
}
  


    async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await createUser({ 
      username: 'Calebtherock', 
      password: 'therock941',
      
    });
        }catch(error){
            console.log('Error creating users!')
            throw error}
    };
    

module.exports = {
    createUser, getUsers, createInitialUsers
}