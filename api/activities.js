const express = require('express');
const activitiesRouter = express.Router();
const { requireUser }  = require('../db/users')
const { createActivity, updateActivity, getAllActivities } = require('../db/activities')
const { getPublicRoutinesByActivity } = require('../db/routines')

activitiesRouter.use((req,res,next)=>{
    console.log('A request is being made to our activities router!');
    next();
});


activitiesRouter.get('/',async (req,res)=>{
    try{
        const allActivites = await getAllActivities();
        res.send(allActivites);
    }catch(error){
        throw error}
});


activitiesRouter.post('/', requireUser, async (req,res)=>{
    const { name, description } = req.body;
    const activityData = {}
    try{
        activityData.name = name
        activityData.description = description
        const newActivity = await createActivity( activityData )
        if ( newActivity ){
            res.send( newActivity )
        }
    } catch(error){
        throw error
     }
});


activitiesRouter.patch('/:activityId', requireUser, async (req,res)=>{
    const { activityId } = req.params
    try{
        const updatedActivity = await updateActivity({ activityId})
        if(updatedActivity){
            res.send( updatedActivity )
        }
    } catch (error){
        throw error
    }
});

activitiesRouter.get('/:activityId/routines', requireUser, async (req, res)=>{
    const { activityId } = req.params
    try{
        const routinesWithActivity = await getPublicRoutinesByActivity({activityId})
        if( routinesWithActivity) {
            res.send(routinesWithActivity)
        }
    }catch(error){throw error}
})

module.exports = activitiesRouter;



