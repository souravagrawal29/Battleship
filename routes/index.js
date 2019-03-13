const express = require('express');
const path = require('path');
const router = express.Router();

module.exports = (passport) => {

    const auth = require('./auth')(passport);
    const user = require('./user')(passport);
    const admin = require('./admin')(passport);
    const lb = require('./leaderboard')(passport);
    
    router.get('/', auth.redirectIfLoggedIn, (req, res) => {
        return res.render('layouts/main');
    });

    //auth routes
    router.post('/login', auth.login);
    router.get('/logout', auth.logout);

    //user routes 
    router.get('/user', auth.isLoggedIn, user.home);
    router.get('/questions', auth.isLoggedIn, user.questions);
    router.get('/battleship', auth.isLoggedIn, user.battleship);
    router.get('/questions/:id', auth.isLoggedIn, user.questionbyid);
    router.post('/submit', auth.isLoggedIn, user.submit);
    router.post('/revive', auth.isLoggedIn, user.revive);
    router.get('/leaderboard', auth.isLoggedIn, lb.getLeaderboard);
    router.get('/hit', auth.isLoggedIn, (req, res) => {
        return res.render('hit');
    });
    router.post('/hit', auth.isLoggedIn, user.hit);

    //admin routes
    router.get('/addQuestion', auth.isAdminLoggedIn, admin.addquestion);
    router.get('/editQuestion/:id', auth.isAdminLoggedIn, admin.updatequestion);
    router.post('/addQuestion', auth.isAdminLoggedIn, admin.addquestion);
    router.post('/editQuestion/:id', auth.isAdminLoggedIn, admin.updatequestion);
    router.get('/updategrid', auth.isAdminLoggedIn, admin.initgrid);
    router.get('/viewships',auth.isAdminLoggedIn, admin.viewships);
    
    return router;
}
