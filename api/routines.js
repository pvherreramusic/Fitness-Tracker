const express = require('express');
const routinesRouter = express.Router();
const { requireUser } = require('../db/users')
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

console.log('Heres require user' ,requireUser)
routinesRouter.post('/', requireUser, async( req,res, next )=>{
    const { name, goal } = req.body
    const routineData = {}
    try{
        routineData.name = name
        routineData.goal = goal
        const newRoutine = await createRoutine( routineData )
        if( newRoutine ){
            res.send ({ newRoutine })
        }
    }catch({name,message}){
        next( {name,message})
    }
});

//need to be the OWNER of the routine, so CREATORID cant be null.
routinesRouter.patch('/:routineId',requireUser,async (req,res)=>{
    const routineId = req.params

    const user = await getUserById()
    //still need to get user
    if (user.id === creatorId)

    try{
        const updatedRoutine =  updateRoutine(routineId)
        if (updatedRoutine){
            res.send(updatedRoutine)
        }
    }catch(error){throw error}
});


routinesRouter.delete('/:routineId', requireUser,async (req,res)=>{
    const routineId = req.params
    try{
        if (routineId){
            //HARD DELETE this routineId somehow
           const activity = await getActivitiesByRoutineId(routineId)
            await destroyRoutineActivities(activity.id)
            await destroyRoutine(routineId)
            res;
        }
    }catch(error){throw error}
});


routinesRouter.post('/:routineId/activities',async (req,res)=>{
  const routineId = req.params
  try{
      if(routineId){
          const activity = await getActivitiesByRoutineId(routineId)
         const updatedRoutine= await addActivityToRoutine(routineId, activity.id, activity.count, activity.duration)
         res.send(updatedRoutine)
      }
  } catch(error){
      throw error
  }
});




module.exports = routinesRouter;