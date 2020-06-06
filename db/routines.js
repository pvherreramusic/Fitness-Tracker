const { client } = require('./client');


async function createRoutine({
  creatorId,  
  name, 
  goal,
  public = false
}){
    try {
     const { rows: [ routines ] } = await client.query(`
       INSERT INTO routines( "creatorId", name, goal, public ) 
       VALUES($1, $2, $3, $4)
       ON CONFLICT (name) DO NOTHING 
       RETURNING *;
     `, [creatorId, name, goal, public]);
     return routines;
   } catch (error) {
     throw error;
   }
};
async function getActivitiesByRoutineId(id){
  const { rows:[activities] } = await client.query(`
        SELECT *
        FROM activities
        JOIN routine_activities ON routine_activities."activityId" = activities.id
        WHERE routine_activities."routineId" = $1;
       `,[id])
        
  return activities
}


async function getAllRoutines() {
  try {
    const { rows:routines } = await client.query(`
      SELECT * 
      FROM routines;
    `);
    for(let routine of routines){
      routine.activities = await getActivitiesByRoutineId(routine.id);
    };
    return routines
  } catch (error) {
    throw error;
  }
};


async function getPublicRoutines(){
  try {
    const { rows:routines } = await client.query(`
      SELECT *
      FROM routines
      WHERE public=true;
    `);
    for(let routine of routines){
      routine.activities = await getActivitiesByRoutineId(routine.id);
    };

    return routines 
  } catch (error) {
    throw error;
  }
};


async function createInitialRoutines(){
  try{
   
    await createRoutine({  creatorId:1, name:'Play a game of basketball', goal:'play 3x times a day'})

    await createRoutine({ creatorId:2, name:'Running', goal:'Go for a jog at least twice per week!', public:true})


  } catch(error){
    console.log('Error creating routines!')
    throw error
  }
};



async function getAllRoutinesByUser({ username }) {
     let name = username
     console.log(name,username)
    try {
       
       const { rows:[user] } = await client.query(`
        SELECT * 
        FROM users
        WHERE username = $1
       `, [name])
       
      
      console.log(user)
       const { rows: routines } = await client.query(`
         SELECT *
         FROM routines 
         WHERE "creatorId"=${ user.id }
       `)

      for(let routine of routines){
        routine.activities = await getActivitiesByRoutineId(routine.id);
      };
    
      return routines;
     } catch (error) {
       throw error;
     }
 };
 
 

async function getPublicRoutinesByUser({creatorId}) {
     try {
       const { rows: routines } = await client.query(`
       SELECT *
       FROM routines
       WHERE "creatorId"=${creatorId} 
       AND public=true
       `);
       for(let routine of routines){
        routine.activities = await getActivitiesByRoutineId(routine.id);
      };
      return routines;
     } catch (error) {
       throw error;
     }
 };
   
 
async function getPublicRoutinesByActivity({ activityId }){
     try {
       const { rows: publicRoutines } = await client.query(`
         SELECT *
         FROM routines
         JOIN routine_activities ON routines.id=routine_activities."routineId"
         JOIN activities ON activities.id=routine_activities."activityId"
         WHERE routines.public=true 
         AND routine_activities."activityId"=$1
       `, [activityId]);
        return publicRoutines
     } catch (error) {
       throw error;
     }
 }; 


async function updateRoutine({ id, public, name, goal}) {
  const setString = Object.keys({id, public, name, goal}).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

    try {
    if (setString.length > 0) {
     const {rows:updatedRoutine} = await client.query(`
        UPDATE routines
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values({id, public, name, goal}));
      return updatedRoutine
   }
    } catch (error) {
        throw error;
  }   
};





  async function destroyRoutine(id){
    try{
      await client.query(`
      DELETE FROM routines
      WHERE "id" = $1
      `, [id]);
      }
    catch(error){
        throw error
      }
    }

  
module.exports = {
  createRoutine, updateRoutine, getAllRoutines, getPublicRoutines, getPublicRoutinesByActivity, getPublicRoutinesByUser, getAllRoutinesByUser
  ,createInitialRoutines, destroyRoutine};