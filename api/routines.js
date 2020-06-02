const express = require('express');
const routinesRouter = express.Router();
const requireUser = require('../users')

routinesRouter.use((next)=>{
    console.log('A request is being made to the routines router!');
    next();
});

//in here will be something like getAllRoutines
routinesRouter.get('/',( res )=>{
   try{ 
    const routines = await getAllRoutines();
    res.send(routines)
   }catch(error){
       throw error
   }
});

//And here would be calling createNewRoutine
routinesRouter.post('/', requireUser, async ( req,res )=>{
    const { name, goal } = req.body
    const routineData = {}
    try{
        routineData.name = name
        routineData.goal = goal
        const newRoutine = await createRoutine( routineData )
        if( newRoutine ){
            res.send( newRoutine )
        }
    }catch(error){
        throw error
    }
});

//call edit routine once its working.
routinesRouter.patch('/:routineId',(req,res,err)=>{});

module.exports = routinesRouter;