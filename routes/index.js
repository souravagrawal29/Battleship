const express = require('express');
const path = require('path');
const router = express.Router();

module.exports = (passport) =>{

    const auth = require('./auth')(passport);
    
    router.get('/',(req,res)=>{
        res.send('Welcome Bitches');
    });

    router.get('/login', (req, res) => {
		res.sendFile(path.resolve(__dirname + '/../views/login.html'));
	});

    router.post('/login',auth.login, (req, res) => {
    	console.log(req.user);
    	res.redirect('/');
    });
    router.ger('/questions' (req,res) =>{
        console.log(req.user); // this gives undefined afer logging in 
    });
    
    return router;
}