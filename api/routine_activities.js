const express = require('express');
const routine_activitiesRouter = express.Router();
const requireUser = require('../db/users')


//IN TESTING
routine_activitiesRouter.use(next=>{
    console.log('A request is being made to the routine_activities router!')
    next();
});

routine_activitiesRouter.patch('/:routineActivityId',requireUser, req,res=>{
    const { routineActivityId } = req.params
    const { count, duration} = req.body
    
    const updatedRA = await updateRoutineActivity( routineActivityId, count, duration)
    try{
        if(updatedRA){
        res.send(updatedRA)
        }
    }catch(error){throw error}


});


routine_activitiesRouter.delete('/:routineActivityId', requireUser, req,res =>{
    const { routineActivityId } = req.params
    const deleteact = await destroyRoutineActivity(routineActivityId)
    delete deleteact;
    const routine = getAllRoutines()
  try {
    if(res){
    res.send(routine)
    }
     }catch (error) {
  }
});