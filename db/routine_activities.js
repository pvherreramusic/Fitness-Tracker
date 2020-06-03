//>>>>>>>>>>>>>>>>>STILL NEED TO TEST>>>>>>>>>>>>>>>>>>>>>>>

async function addActivityToRoutine({ routineId, activityId, count, duration }){
    
        try {
         const { rows: [ activityToRoutine ] } = await client.query(`
           INSERT INTO routine_activities(id, public, name, goal) 
           VALUES($1, $2, $3, $4)
           RETURNING *;
         `, [routineId, activityId, count, duration]);
       
         return activityToRoutine;
       } catch (error) {
         throw error;
       }
    };

async function updateRoutineActivity({ id, count, duration }){
    const setString = Object.keys(count, duration).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
    
        try {
        if (setString.length > 0) {
          await client.query(`
            UPDATE routine_activities
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
          `, Object.values(count, duration));
       }
        } catch (error) {
            throw error;
      }   
 };

//ADD TO ROUTE ONCE WRITTEN
function destroyRoutineActivity(){}




module.exports = {addActivityToRoutine, updateRoutineActivity, destroyRoutineActivity}