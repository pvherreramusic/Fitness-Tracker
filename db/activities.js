const { client } = require('./client');
const chalk = require('chalk')


async function createActivity({
    name,
    description= ''
  }) {
    try {
      const { rows: [ activity ] } = await client.query(`
        INSERT INTO activities(name, description) 
        VALUES($1, $2)
        ON CONFLICT (name) DO NOTHING 
        RETURNING *;
      `, [name, description]);
  
      return activity;
    } catch (error) {
      throw error;
    }
  }

  
async function getAllActivities() {
        try {
          const { rows: activities } = await client.query(`
            SELECT *
            FROM activities;
          `);
          return activities;
        } catch (error) {
          throw error;
        }
  }



async function createInitialActivities(){
    try{
        
        await createActivity({ name:'Basketball', description:'Game of horse, anyone?'})

        await createActivity({name:'Skateboarding', description:'Game of skate instead?'})

    }catch(error){
        throw error
    }
};


  async function updateActivity({ id, name, description }){

  const setString = Object.keys({name, description}).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

    try {
    if (setString.length > 0) {
      const {rows: updatedActivty } = await client.query(`
        UPDATE activities
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values({name, description}));
      return updatedActivty
   }
    } catch (error) {
        throw error;
  }
}

async function getActivitiesByRoutineId(id){
  const { rows:[activities] } = await client.query(`
        SELECT *
        FROM activities
        JOIN routine_activities ON routine_activities."activityId" = activities.id
        WHERE routine_activities."routineId" = $1;
       `,[id])
        
  return activities
}

module.exports = {
    createActivity, getAllActivities, createInitialActivities, updateActivity, getActivitiesByRoutineId
};

