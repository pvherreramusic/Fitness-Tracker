const { client } = require('./client');

//I think we'll need to add the activities to a routine here as a property activities=[]
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



    
 // Returning an empty array...
async function getAllRoutinesByUser({ username }) {
     let name = username
    try {
       // Get a user
       const { rows:[user] } = await client.query(`
        SELECT users 
        FROM users
        WHERE $1
       `, [name])
       
      //Get that users routines
       const { rows: routines } = await client.query(`
         SELECT id
         FROM routines 
         WHERE "creatorId"=${ user.id }
       `)
      //Loop over routines, for each routine
      // find the activities for that routine
        // routine.activities = activities (the ones we just found) 

     const { rows:activities } = await client.query(`
          SELECT activities
          FROM activities
          WHERE ${ routines.activities } = name
         `)


      routines.forEach(function(routine){
        routine.activities = activities
        return routines;
      })
      //once this is working, make a helper function to use in the other ones that need activities.
     } catch (error) {
       throw error;
     }
 };
 
 
 //Also returning an empty array.
async function getPublicRoutinesByUser({creatorId}) {
     try {
       const { rows:routines } = await client.query(`
       SELECT *
       FROM routines
       WHERE "creatorId"=${creatorId} 
       AND public=true
       `);
       const publicUserRoutines = await Promise.all(routines.map(
        routine => getAllRoutinesByUser( {creatorId} )
      ));
      return publicUserRoutines;
   
     } catch (error) {
       throw error;
     }
 };
   
 //Also returning an empty array.
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