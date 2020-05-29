const express = require('express');
const activitiesRouter = express.Router();

activitiesRouter.use((next)=>{
    console.log('A request is being made to our activities router!');
    next();
});

//in here we can put a function to get all the activities
activitiesRouter.get('/',(req,res,next)=>{
    try{
        const allActivites = await getAllActivities();
        res.send(allActivites);
    }catch(error){
        throw error}
});

//in here we can send a request to post a new activity(if logged in)
activitiesRouter.post('/',(req,res,next)=>{});

//in here we can try and edit an activity(if its ours!)
activitiesRouter.patch('/:activityId',(req,res,next)=>{});

module.exports = activitiesRouter;



