const { client } = require('./client');


async function addActivityToRoutine({ routineId, activityId, count, duration }){
    
        try {
         const { rows: [ activityToRoutine ] } = await client.query(`
           INSERT INTO routine_activities("routineId", "activityId", "count", "duration") 
           VALUES($1, $2, $3, $4)
           RETURNING *;
         `, [routineId, activityId, count, duration]);
       
         return activityToRoutine;
       } catch (error) {
         throw error;
       }
    };

  
async function updateRoutineActivity({ id, count, duration }){
    const setString = Object.keys({count, duration}).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
        try {
        if (setString.length > 0) {
         const { rows: [updatedRoutine] } = await client.query(`
            UPDATE routine_activities
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
          `, Object.values({count, duration}));
          return updatedRoutine
       }
      
        } catch (error) {
            throw error;
      }   
 };


async function destroyRoutineActivity(activityId){
  try{
  await client.query(`
  DELETE FROM routine_activities
  WHERE "activityId" = $1
  `, 
  [activityId]);
  }
catch(error){
    throw error
  }
}


module.exports = {addActivityToRoutine, updateRoutineActivity, destroyRoutineActivity}