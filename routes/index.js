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
        res.send('No admin permissions');
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
    router.get('/user', isLoggedIn, user.home);
    router.get('/questions', isLoggedIn, user.questions);
    router.get('/battleship', isLoggedIn, user.battleship);
    router.get('/questions/:id', isLoggedIn, user.questionbyid);

    //admin routes
    router.get('/addquestion', isAdminLoggedIn, admin.addquestion);
    router.get('/updatequestion/:id', isAdminLoggedIn, admin.updatequestion);
    router.post('/addquestion', isAdminLoggedIn, admin.addquestion);
    router.post('/updatequestion/:id', isAdminLoggedIn, admin.updatequestion);
    router.get('/updategrid', isAdminLoggedIn, admin.initgrid);
    
    return router;
}
