const { client } = require('./client');


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

//   async function updateActivity({ id, name, description })

//   const setString = Object.keys(name, description).map(
//     (key, index) => `"${ key }"=$${ index + 1 }`
//   ).join(', ');

//     try {
//     // update any fields that need to be updated
//     if (setString.length > 0) {
//       await client.query(`
//         UPDATE activities
//         SET ${ setString }
//         WHERE id=${ id }
//         RETURNING *;
//       `, Object.values(name, description));
//    }
//     } catch (error) {
//         throw error;
//   }

async function createInitialActivities(){
    try{
        console.log(chalk.yellow('Making you some activities!'))
        await createActivity({ name:'basketball', description:'Game of horse ,anyone?'})

    }catch(error){
        throw error
    }
};

module.exports = {
    createActivity, getAllActivities, createInitialActivities
};