const mysql = require('mysql');
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err)=> {
    if(err){
        console.log(err);
        return;
    }
    else console.log('Database Connected');
});

module.exports = (passport) =>{
    let exp = {};

    exp.login = (req,res) =>{
        let err,query;

        sql = 'SELECT * FROM Users WHERE username = ? AND pass = ?';
        db.query(sql,[req.body.username,req.body.pass],(err,row,fields)=>{
            if(err){
                console.log(err);
                return res.sendStatus(404);
            }
            else{
                if(!row.length){
                    return res.status(404).send('Invalid username/password');
                }
                else {
                    req.login(row[0],err=>{
                        if(err){
                            console.log(err);
                            return res.status(404).send(err);
                        }
                        else {
                            console.log(req.user);
                            return res.status(200).send('Login Successful');
                        }
                    });
                }
            }
        });

    };
    return exp;
}