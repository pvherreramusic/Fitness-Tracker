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

  async function getUsers() {
    try {
      const { rows } = await client.query(`
        SELECT username, password
        FROM users;
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async function createPost({
    name,
    description= []
  }) {
    try {
      const { rows: [ post ] } = await client.query(`
        INSERT INTO posts(name, description ) 
        VALUES($1, $2)
        RETURNING *;
      `, [name, description]);
  
      return post;
    } catch (error) {
      throw error;
    }
  }