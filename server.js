require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const db = require('./models/dbcon')
const favicon = require('serve-favicon');

db.connect((err) =>{
    if(err){
        console.log(err);
        return;
    }
    console.log('Database Connected');
});

const app = express();

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.use(session({
    secret: 'battleship19',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

passport.use('local',new Strategy({
    usernameField: 'username',
    passwordField: 'pass',
    passReqToCallback:true
    },
    (req, username, password, done) =>{
        db.query('SELECT * FROM `Users` WHERE `username` = ? AND `pass` = ?', [username, password], (err, result) =>{
            if (err) {
                console.log('error:', err.stack);
                return done(err);
            }
            if (result.length == 0) {
                console.log('Invalid Details');
                return done(null,false,req.flash('loginMessage','User with credentials not found'));
            }
            return done(null,result[0]);
        });
    })
);


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('battleship19'));
app.use(passport.initialize());
app.use(passport.session());



require('./config/passport')(passport);

app.use('/',require('./routes')(passport));

const port = process.env.PORT || 3000;

app.listen(port, err =>{
    if(err){
        console.log(err);
        res.sendStatus(404);
    }
    else
        console.log(`Listening on ${port}`);
});