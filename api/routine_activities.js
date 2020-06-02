const express = require('express');
const routine_activitiesRouter = express.Router();
const requireUser = require('../users')

routine_activitiesRouter.use(next=>{
    console.log('A request is being made to the routine_activities router!')
    next();
});

routine_activitiesRouter.patch('/:routineActivityId',requireUser, req,res=>{
    const { routineActivityId } = req.params


});

routine_activitiesRouter.delete('/:routineActivityId', requireUser, req,res =>{
    const { routineActivityId } = req.params

});