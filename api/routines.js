const express = require('express');
const routinesRouter = express.Router();

routinesRouter.use((req,res,next)=>{
    console.log('A request is being made to the routines router!');
    next();
});

//in here will be something like getAllRoutines
routinesRouter.get('/',(req,res,err)=>{});

//And here would be calling createNewRoutine
routinesRouter.post('/',(req,res,err)=>{});

//something like editRoutine
routinesRouter.patch('/',(req,res,err)=>{});

module.exports = routinesRouter;