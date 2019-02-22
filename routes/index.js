const express = require('express');
const router = express.Router();

module.exports = (passport) =>{

    const auth = require('./auth')(passport);
    
    router.get('/',(req,res)=>{
        res.send('Welcome Bitches');
    });
    router.post('/login',auth.login);
    return router;
}

