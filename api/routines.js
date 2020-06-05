const express = require('express');
const routinesRouter = express.Router();
const requireUser = require('../db/users')
const { updateRoutine } = require('../db/routines')

routinesRouter.use((next)=>{
    console.log('A request is being made to the routines router!');
    next();
});


routinesRouter.get('/',( res )=>{
   try{ 
    const pubRoutines =  getPublicRoutines();
    if(pubRoutines){
    res.send( pubRoutines )
    }
   }catch(error){
       throw error
   }
});


routinesRouter.post('/', requireUser, async( req,res )=>{
    const { name, goal } = req.body
    const routineData = {}
    try{
        routineData.name = name
        routineData.goal = goal
        const newRoutine = createRoutine( routineData )
        if( newRoutine ){
            res.send( newRoutine )
        }
    }catch(error){
        throw error
    }
});

//need to be the OWNER of the routine, so CREATORID cant be null.
routinesRouter.patch('/:routineId',requireUser,(req,res)=>{
    const routineId = req.params
    try{
        const updatedRoutine =  updateRoutine(routineId)
        if (updatedRoutine){
            res.send(updatedRoutine)
        }
    }catch(error){throw error}
});


routinesRouter.delete('/:routineId', requireUser,(req,res)=>{
    const routineId = req.params
    try{
        if (routineId){
            //HARD DELETE this routineId somehow
        }
    }catch(error){throw error}
});


routinesRouter.post('/:routineId/actiivites',(req,res)=>{
    //Attach a single activity to a routine. Prevent duplicates on routineId and activityId
});




module.exports = routinesRouter;