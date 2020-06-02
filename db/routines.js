const { client } = require('./client');

//we need to include the activities with the routines were returning.
async function getAllRoutines() {
    try {
      const { rows } = await client.query(`
        SELECT * 
        FROM routines;
      `);
      return rows
    } catch (error) {
      throw error;
    }
};

//I think we'll need to add the activities to a routine here as a property activities=[]
async function createRoutine({  
  name, 
  goal, 
  public
}){
    try {
     const { rows: [ routines ] } = await client.query(`
       INSERT INTO routines(name, goal, public) 
       VALUES($1, $2, $3)
       ON CONFLICT (name) DO NOTHING 
       RETURNING *;
     `, [name, goal, public ]);
     return routines;
   } catch (error) {
     throw error;
   }
};

async function createInitialRoutines(){
  try{
   
    await createRoutine({ name:'Play a game of basketball', goal:'play 3x times a day'})

    await createRoutine({name:'Running', goal:'Go for a jog at least twice per week!', public:true})


    //public is defaulting to null instead of false
    //creatorId is null instead of referencing users.

  } catch(error){
    console.log('Error creating routines!')
    throw error
  }
};


module.exports = {
    createRoutine, updateRoutine, getAllRoutines, getPublicRoutines, getPublicRoutinesByActivity, getPublicRoutinesByUser, getAllRoutinesByUser
    ,createInitialRoutines};


//>>>>>>>>>>>>>STILL NEED TO TEST>>>>>>>>>>>>>>>>>>>>>>>
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
 
 //We need to include the activities that the routines contain here
async function getPublicRoutines(){
     try {
       const { rows } = await client.query(`
         SELECT *
         FROM routines
         WHERE public=true;
       `);
   
       return { rows }
     } catch (error) {
       throw error;
     }
 };
 
async function getPublicRoutinesByUser({username}) {
     try {
       const { rows } = await client.query(`
       SELECT *
       FROM routines
       WHERE username=${username} 
       AND public=true
       `);
   
       return { rows }
     } catch (error) {
       throw error;
     }
 };
   
async function getPublicRoutinesByActivity({ activityId }){
    ///May not work because it has not been tested.
     try {
       const { rows: publicRoutines } = await client.query(`
         SELECT *
         FROM routines
         JOIN routine_activities ON routines.id=routine_activities."routineId"
         JOIN activities ON activities.id=routine_activities."activityId"
         WHERE routines.public=true 
         AND routine_activities."activityId"=$1
       `, [activityId]);
       console.log(publicRoutines)
     } catch (error) {
       throw error;
     }
 }; 