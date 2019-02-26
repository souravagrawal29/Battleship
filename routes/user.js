const db = require('../models/dbcon');

module.exports =  () =>{
    let exp = {};

    //instuctions page
    exp.home = (req,res) =>{
        res.send('In the Rules page');
    };

    //main homepage
    exp.questions = (req,res) =>{
        res.send('In the questions homepage');
    };

    //grid 
    exp.battleship = (req,res) =>{

        db.query('SELECT row,col,isactive from Grid WHERE uid=?',[req.user[0].uid],(err,ships)=>{
            if(err){
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }
            if(ships.length==0)
                return res.status(500).send('Internal Server Error');
            db.query('SELECT row,col,hit from Shiplogs WHERE uid=?',[req.user[0].uid],(err,fired) =>{
                if(err){
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                }
                let result = {ships, fired};
                return res.json(result); // sends the locations of his fired missiles plus the location of his own ships
            });
        });
    };

    //viewing a particular question
    exp.questionbyid = (req,res) => {
        res.send('viewing a question');
    };

    return exp;
};