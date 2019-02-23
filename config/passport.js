const passport = require('passport');
const db = require('../models/dbcon');

db.connect((err) => {
	if (err) {
		console.error('error: ', err.stack);
		return;
	}
	
	console.log('Connected to Database');
});

passport.use(new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, (username, password, done) => {
	db.query('SELECT * FROM `Users`', (err, result) => {
		if (err) {
			console.error('error: ', err.stack);
			return done(err);
		}

		if (result) {
			console.log('User not found');
			return done(null, false);
		}

		if (result.password != password) {
			return done(null, false);
		}

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