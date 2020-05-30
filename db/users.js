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

async function getUsers({ username, password }) {
    try {
        const { rows: [users] } = await client.query(`
          SELECT *
          FROM users
          WHERE username=$1, password=$2
        `, [username, password]);
    
        return users;
      } catch (error) {
        throw error;
      }
    };

    async function createInitialUsers(){
        try{
            console.log(chalk.yellow('Making you some users!'))
           await createUser({ username:'calebjhenderson', password: 'codelyf3' });
    
        }catch(error){
            console.log('Error creating users!')
            throw error}
    };
    

module.exports = {
    createUser, getUsers, createInitialUsers
}