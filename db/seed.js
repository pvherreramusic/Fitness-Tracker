const { client  } = require('./index')
const { getUser, createUser} = require('./users')
const { createActivity, getAllActivities } = require('./activities')
const { createRoutine, getAllRoutines, getAllRoutinesByUser, updateRoutine} = require('./routines')
const { addActivityToRoutine, updateRoutineActivity, destroyRoutineActivity } = require ('./routine_activities')
const chalk = require('chalk');


async function dropTables(){
    try{
        console.log('Starting to drop the tables!');
        await client.query(`
        DROP TABLE IF EXISTS routine_activities; 
        DROP TABLE IF EXISTS routines; 
        DROP TABLE IF EXISTS activities;
        DROP TABLE IF EXISTS users;
        `);
    }catch(error){
        console.log(chalk.red('Error dropping the tables.'))
        throw error
    }
};

async function createTables(){
    try{
        console.log('Starting to build the tables!')
        await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL, 
            password VARCHAR(255) NOT NULL
        );

        CREATE TABLE activities(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255)UNIQUE NOT NULL,
            description TEXT NOT NULL
        );

        CREATE TABLE routines(
            id SERIAL PRIMARY KEY,
            "creatorId" INTEGER REFERENCES users,
            public BOOLEAN DEFAULT FALSE,
            name VARCHAR(255) UNIQUE NOT NULL,
            goal TEXT NOT NULL
        );

        CREATE TABLE routine_activities(
            id SERIAL PRIMARY KEY,
            "routineId" INTEGER REFERENCES routines,
            "activityId" INTEGER REFERENCES activities,
            duration INTEGER,
            count INTEGER
        );
        `)
    }catch(error){
        console.log(chalk.red('Error creating tables :('))
        throw(error);
    }
};

async function buildDB(){
    try{
        client.connect();
        await dropTables();
        await createTables();
    } catch(error){
        console.log(chalk.red('Uh-Oh!'))
        throw error;
    }
};

async function testDB(){
    try{
        console.log('Testing the database now!');

        console.log('Calling getUser!');
        const allUsers = await getUser();
        console.log('Here are all the users...', allUsers);

        console.log('Calling getAllActivities!');
        const allActivities = await getAllActivities();
        console.log('Here are all the activities...', allActivities);

        console.log('Calling getAllRoutines!');
        const allRoutines = await getAllRoutines();
        console.log('Here are all the routines...', allRoutines);


        //NEED TO ADD THE REST OF THE FUNCTIONS AFTER THEY'RE WRITTEN IN /INDEX.js!

        console.log('Done testing the database :)');

    }catch(error){
        console.log('Error testing your database!')
        throw error
    }

}

buildDB()
.then(testDB)
.catch(console.error)

.finally(()=>client.end());