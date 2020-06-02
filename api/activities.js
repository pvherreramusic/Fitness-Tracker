const express = require('express');
const activitiesRouter = express.Router();
const requireUser = require('../users')
const { createActivity, updateActivity } = require('../activities')
const { getPublicRoutinesByActivity } = require('../routines')

activitiesRouter.use((next)=>{
    console.log('A request is being made to our activities router!');
    next();
});


activitiesRouter.get('/',( res )=>{
    try{
        const allActivites = await getAllActivities();
        res.send(allActivites);
    }catch(error){
        throw error}
});


activitiesRouter.post('/', requireUser, async ( req,res )=>{
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


activitiesRouter.patch('/:activityId', requireUser,(req,res)=>{
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

activitiesRouter.get('/:activityId/routines', requireUser,(req, res)=>{
    const { activityId } = req.params
    try{
        const routinesWithActivity = await getPublicRoutinesByActivity({activityId})
        if( routinesWithActivity) {
            res.send(routinesWithActivity)
        }
    }catch(error){throw error}
})

module.exports = activitiesRouter;



