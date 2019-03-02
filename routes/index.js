const express = require('express');
const path = require('path');
const router = express.Router();

const isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated())
        next();
    else
        res.redirect('/');
}

const isAdminLoggedIn = (req, res, next) => {
    if(req.isAuthenticated() && req.user[0].access == 1)
        return next();
    else if(req.isAuthenticated())
        res.redirect('/questions');
    else
        res.redirect('/');
}

const redirectIfLoggedIn = (req,res,next) => {
    if(req.isAuthenticated())
        res.redirect('/user');
    else
        return next();
};

module.exports = (passport) =>{

    const auth = require('./auth')(passport);
    const user = require('./user')(passport);
    const admin = require('./admin')(passport);
    const lb = require('./leaderboard')(passport);
    
    router.get('/',redirectIfLoggedIn,(req, res)=>{
        res.render('layouts/main');
    });

    //auth routes
    router.post('/login', auth.login);

    //user routes 
    router.get('/user', isLoggedIn, user.home);
    router.get('/questions', isLoggedIn, user.questions);
    router.get('/battleship', isLoggedIn, user.battleship);
    router.get('/questions/:id', isLoggedIn, user.questionbyid);
    router.get('/leaderboard', isLoggedIn, lb.getLeaderboard);

    //admin routes
    router.get('/addQuestion', isAdminLoggedIn, admin.addquestion);
    router.get('/editQuestion/:id', isAdminLoggedIn, admin.updatequestion);
    router.post('/addQuestion', isAdminLoggedIn, admin.addquestion);
    router.post('/editQuestion/:id', isAdminLoggedIn, admin.updatequestion);
    router.get('/updategrid', isAdminLoggedIn, admin.initgrid);
    
    return router;
}
