const db = require('../models/dbcon');


module.exports =  () =>{
    let exp = {};

    exp.home = (req,res) =>{
        res.send('In the Rules page');
    };

    exp.questions = (req,res) =>{
        res.send(req.user);
    };

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

    return exp;
};