const db = require('../models/dbcon');

module.exports = (passport) => {
    passport.serializeUser((User,done) => {
    	return done(null,User.uid);
    });
  
    passport.deserializeUser((uid,done) => {
        db.query('SELECT uid,username,access,score,missile FROM Users where uid = ?',[uid],(err,rows) =>{
            return done(err,rows[0]);
        });
    });
}