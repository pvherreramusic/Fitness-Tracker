



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
  }

  async function getUser({ username, password }) {
    try {
        const { rows: [user] } = await client.query(`
          SELECT *
          FROM users
          WHERE username=$1, password=$2
        `, [username, password]);
    
        return user;
      } catch (error) {
        throw error;
      }
    };
