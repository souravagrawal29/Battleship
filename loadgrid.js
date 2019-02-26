require('dotenv').config();
const fs = require('fs');
const db = require('./models/dbcon');

function cleardata(callback) {
	db.query('DELETE FROM Grid', (err, results) => {
		if (err) console.log('Error: ' + err);
	});

	callback();

	console.log("Done!");
}

function load() {
	fs.readFile('grid.txt', 'utf8', (err, data) => {
		if (err) {
			console.log("Error: " + err);
			return;
		}

		const n = 11;

		var grid = new Array(n);
		for (var i = 0; i < grid.length; i++) {
			grid[i] = new Array(n);
		}

		let x = 0;
		for (var i = 0; i < data.length; i++) {
			for (var j = 0; j < n; j++, i++) {
				grid[x][j] = parseInt(data[i]);
			}
			x++;
		}



		for (var i = 0; i < n; i++) {
			for (var j = 0; j < n; j++) {
				if (grid[i][j] == 0)
					continue;

				db.query("INSERT INTO Grid VALUES (?, ?, (SELECT uid from Users WHERE uid = ?), ?)", [i, j, grid[i][j], 1], (err, results) => {
					if (err) {
						console.log("Error: " + err);
						return;
					}
				});
			}
		}
	});
}

module.exports = cleardata(load);