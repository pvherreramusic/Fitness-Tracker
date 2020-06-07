const express = require('express');
const routinesRouter = express.Router();
const { requireUser, getUserByRoutineId } = require('../db/users')
const { updateRoutine, getPublicRoutines } = require('../db/routines')
const { getActivitiesByRoutineId } = require('../db/activities')

routinesRouter.use((req, res, next)=>{
    console.log('A request is being made to the routines router!');
    next();
});


routinesRouter.get('/',(req,res,next)=>{
   try{ 
    const pubRoutines =  getPublicRoutines();
    if(pubRoutines){
    res.send( pubRoutines )
    }
   }catch(error){
       throw error
   }
});


routinesRouter.post('/', requireUser, async(req, res, next)=>{
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

routinesRouter.patch('/:routineId',requireUser,async (req,res)=>{
    const routineId = req.params
    const {rows:routines}= await getAllRoutines()
    const user = await getUserByRoutineId(routineId)
    if (user.id === routines.creatorId){
        try{
            const updatedRoutine =  updateRoutine(routineId)
            if (updatedRoutine){
                res.send(updatedRoutine)
            }
        }catch(error){
            throw error}
    }
});


routinesRouter.delete('/:routineId', requireUser,async (req,res)=>{
    const routineId = req.params
    try{
        if (routineId){
           const activities = await getActivitiesByRoutineId(routineId)
            await destroyRoutineActivities(activities.id)
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