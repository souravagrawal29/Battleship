const db = require('../models/dbcon');

module.exports = () => {
	let exp = {};

	exp.getLeaderboard = (req, res) => {
		db.query('SELECT u.uid, u.username, u.score, count(*) as health \
			FROM Users u INNER JOIN Grid g ON u.uid = g.uid \
			WHERE g.isactive = 1 \
			GROUP BY u.uid \
			ORDER BY u.score DESC, health DESC', (err, users) => {
				if (err) {
					console.log(err);
					return res.render('layouts/error',{
						error: 500,
						message: 'Internal Server Error'
					});
				}

				for (var i in users) {
					users[i].rank = parseInt(i) + 1;
				}

				return res.render('layouts/leaderboard', {
					users: users.map(user => ({...user}))
				});
		});
	}

	return exp;
}