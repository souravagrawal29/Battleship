const express = require('express');
const path = require('path');
const router = express.Router();

module.exports = (passport) =>{

    const auth = require('./auth')(passport);
    
    router.get('/',(req,res)=>{
        res.send('Welcome Bitches');
    });

    router.get('/login', (req, res) => {
		res.render('layouts/main');
	});

    router.post('/login', auth.login, (req, res) => {
    	// console.log(req.session);
        // console.log(req.isAuthenticated()); // true
    	res.redirect('/questions');
    });
    router.get('/questions', (req,res) =>{
        // console.log(req.user);
        // console.log(req.isAuthenticated()); // true
        res.send('In the questions route');
    });
    
    return router;
}