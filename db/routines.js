const { client } = require('./client');

//Activities will get added in addActivityToRoutine(){}
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


module.exports = {
    createRoutine, updateRoutine, getAllRoutines, getPublicRoutines, getPublicRoutinesByActivity, getPublicRoutinesByUser, getAllRoutinesByUser
    ,createInitialRoutines};



    
 
async function getAllRoutinesByUser({ username }) {
     let name = username
     console.log(name,username)
    try {
       // Get a user
       const { rows:[user] } = await client.query(`
        SELECT * 
        FROM users
        WHERE username = $1
       `, [name])
       
      //Get that users routines
      console.log(user)
       const { rows: routines } = await client.query(`
         SELECT *
         FROM routines 
         WHERE "creatorId"=${ user.id }
       `)
      // Loop over routines, for each routine
      // find the activities for that routine
        // routine.activities = activities (the ones we just found) 

      for(let routine of routines){
        routine.activities = await getActivitiesByRoutineId(routine.id);
      };
    
      return routines;
      //once this is working, make a helper function to use in the other ones that need activities.
     } catch (error) {
       throw error;
     }
 };
 
 

async function getPublicRoutinesByUser({creatorId}) {
     try {
       const { rows:routines } = await client.query(`
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






//HELPER TO ADD ACTIVITIES
async function getActivitiesByRoutineId(id){
  const { rows:activities } = await client.query(`
        SELECT *
        FROM activities
        JOIN routine_activities ON routine_activities."activityId" = activities.id
        WHERE routine_activities."routineId" = $1;
       `,[id])
        
  return activities
}
  