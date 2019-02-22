const express = require('express');
const router = express.Router();

module.exports = (passport) =>{

    const auth = require('./auth')(passport);
    
    router.post('/login',routes.login);

    return router;
}

