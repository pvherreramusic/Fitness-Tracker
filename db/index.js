
const { client } = require('./client');
client.connect();

module.exports = {  
        client,
        createUser,
        getUser,
        getAllUsers,
        createActivity,
        // updateActivity,
        getAllActivities,
        getAllRoutines,
        createRoutine,
        updateRoutine,
      }
      
      // module.exports = {
//   ...require('./users'), // adds key/values from users.js
//   ...require('./activities'), // adds key/values from activites.js
//   ...require('./routines'), // etc
//   ...require('./routine_activities') // etc
// }