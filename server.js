require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const db = require('./models/dbcon')

db.connect((err) =>{
    if(err){
        console.log(err);
        return;
    }
    console.log('Database Connected');
});

const app = express();

app.use(session({
    secret: 'battleship19',
    resave: false,
    saveUninitialized: false
}));

passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'pass'
    },
    (username, password, done) =>{
        db.query('SELECT * FROM `Users` WHERE `username` = ? AND `pass` = ?', [username, password], (err, result) =>{
            if(err){
                console.log('error:', err.stack);
                return;
            }
            if(result.length == 0){
                console.log('Invalid Details');
                return done(null,false);
            }
            console.log('No error');
            return done(null,result);
        });
    })
);


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
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