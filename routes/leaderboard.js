const db = require('../models/dbcon');

module.exports = () => {
	let exp = {};

	exp.getLeaderboard = (req, res) => {
		db.query('SELECT uid, username, score FROM Users where access = 0 ORDER BY score DESC', (err, users) => {
			if (err) {
				console.log(err);
				return;
			}

			// console.log(users);

			db.query('SELECT COUNT(*) as units, uid from Grid group by uid', (err, result) => {
				if (err) {
					console.log(err);
					return;
				}

				// console.log(result);

				for (var i in result) {
					users[i].health = result[i].units;
				}

				res.send(users);
			});
		});
	}

	return exp;
}