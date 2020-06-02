const express = require('express');
const routinesRouter = express.Router();
const requireUser = require('../users')
const { updateRoutine } = require('../routines')

routinesRouter.use((next)=>{
    console.log('A request is being made to the routines router!');
    next();
});

//still need to return the activities with the routines here
routinesRouter.get('/',( res )=>{
   try{ 
    const pubRoutines = await getPublicRoutines();
    if(pubRoutines){
    res.send( pubRoutines )
    }
   }catch(error){
       throw error
   }
});


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
//need to be the owner of the routine, so creatorId cant be null.
routinesRouter.patch('/:routineId',requireUser,(req,res)=>{
    const routineId = req.params
    try{
        const updatedRoutine = await updateRoutine(routineId)
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
})
routinesRouter.post('/:routineId/actiivites',(req,res)=>{
    //Attach a single activity to a routine. Prevent duplicates on routineId and activityId
});




module.exports = routinesRouter;