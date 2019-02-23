const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const db = require('./models/dbcon');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

db.connect((err) => {
	if (err) {
		console.error('error: ', err.stack);
		return;
	}
	
	console.log('Connected to Database');
});

app.set('trust proxy', 1);

app.use(session({
  secret: 'battleship19',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

passport.use(new Strategy({
	usernameField: 'username',
	passwordField: 'password'
}, (username, password, done) => {
	db.query('SELECT * FROM `Users` WHERE `username` = ? AND `pass` = ?', [username, password], (err, result) => {
		if (err) {
			console.error('error: ', err.stack);
			return done(err);
		}

		if (result.length == 0) {
			console.log('Invalid Details');
			return done(null, false);
		}

		console.log('No error');

		return done(null, result);
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
	res.send("Welcome");
});

app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/views/login.html');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login'}),
	(req, res) => {
		res.redirect('/');
});

app.listen(3000, () => {
	console.log("Listening on 3000");
});