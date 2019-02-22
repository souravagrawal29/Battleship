
const db = require('../models/dbcon.js')







module.exports = (passport) =>{
    let exp = {};

    exp.login = (req,res) =>{
        let err,query;

        query = 'SELECT * FROM Users WHERE username = ? AND pass = ?';
        db.query(query,[req.body.username,req.body.pass],(err,rows,fields)=>{
            if(err){
                console.log(err);
                res.sendStatus(404);
            }
            else{
                if(!row){
                    console.log('Invalid username/password');/
                    res.sendStatus(404).send('Invalid username/password');
                }
                else {
                    req.login(row[0],err=>{
                        if(err){
                            console.log(err)
                            res.sendStatus(404);
                        }
                        else return res.sendStatus(200).send('Login Successful');
                    });
                }
            }
        });

    };
}