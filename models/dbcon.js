const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kt97tulsani',
    database: 'battleship19'
});

module.exports = connection;