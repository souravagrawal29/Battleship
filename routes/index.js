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
    	res.redirect('/questions');
    });
    
    router.get('/questions', (req,res) =>{
        res.send(req.user);
    });
    
    return router;
}