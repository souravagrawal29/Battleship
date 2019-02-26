const db = require('../models/dbcon');

module.exports =  () =>{
    let exp = {};

    exp.addquestion = (req,res) =>{
        res.send('Inside add question');
    };

    exp.updatequestion = (req,res) =>{
        res.send('Inside update question');
    };
    
    return exp;
};