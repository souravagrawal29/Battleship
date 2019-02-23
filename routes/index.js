const express = require('express');
const router = express.Router();

module.exports = (passport) =>{

    const auth = require('./auth')(passport);
    
    app.post('/login', 
	passport.authenticate('local', { failureRedirect: '/login' }),
		function(req, res) {
			res.redirect('/');
	});

    return router;
}

