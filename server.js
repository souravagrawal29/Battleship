require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

require('./config/passport')(passport);

const app = express();

app.use(session({
    secret: 'battleship19',
    resave: false,
    saveUninitialized: false,
    cookie:{ secure: true}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


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
