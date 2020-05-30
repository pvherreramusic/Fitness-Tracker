async function createRoutine({ creatorId, public, name, goal }){
    try {
     const { rows: [ routines ] } = await client.query(`
       INSERT INTO routines(creatorId, public, name, goal) 
       VALUES($1, $2, $3, $4)
       ON CONFLICT (name) DO NOTHING 
       RETURNING *;
     `, [creatorId, public, name, goal]);
   
     return routines;
   } catch (error) {
     throw error;
   }
};
async function updateRoutine({ id, public, name, goal }) {
     const setString = Object.keys(name, goal, public).map(
       (key, index) => `"${ key }"=$${ index + 1 }`
     ).join(', ');
   
       try {
       if (setString.length > 0) {
         await client.query(`
           UPDATE activities
           SET ${ setString }
           WHERE id=${ id }
           RETURNING *;
         `, Object.values(name, goal, public));
      }
       } catch (error) {
           throw error;
     }   
};
   
async function getAllRoutinesByUser({ username }) {
     try {
       const { rows: routines } = await client.query(`
         SELECT id 
         FROM routines 
         WHERE "authorId"=${ username };
       `);
   
       const userroutine = await Promise.all(routines.map(
         routine => getUser( routine.username )
       ));
       return userroutine;
     } catch (error) {
       throw error;
     }
};

   module.exports = {
       createRoutine,
       updateRoutine,
       getAllRoutinesByUser
   }