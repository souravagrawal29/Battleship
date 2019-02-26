const express = require('express');
const path = require('path');
const router = express.Router();

const isLoggedIn = (req,res,next) =>{
    if(req.isAuthenticated())
        next();
    else
        res.redirect('/');
}

module.exports = (passport) =>{

    const auth = require('./auth')(passport);
    const user = require('./user')(passport);
    const admin = require('./admin')(passport);
    
    router.get('/',(req,res)=>{
        res.render('layouts/main');
    });

    //auth routes
    router.post('/login', auth.login);

    //user routes 
    router.get('/user',isLoggedIn,user.home)
    router.get('/questions',isLoggedIn,user.questions);
    router.get('/battleship',isLoggedIn,user.battleship);
    router.get('/questions/:id', isLoggedIn, user.questionbyid);

    //admin routes
    router.post('/addquestion',isLoggedIn,admin.addquestion);
    router.put('/updatequestion/:id',isLoggedIn,admin.updatequestion);

    
    return router;
}
