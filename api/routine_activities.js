const express = require('express');
const routine_activitiesRouter = express.Router();
const requireUser = require('../db/users')



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

//NOT SETUP YET
routine_activitiesRouter.delete('/:routineActivityId', requireUser, req,res =>{
    const { routineActivityId } = req.params
    //hard delete an activity from a routine

});