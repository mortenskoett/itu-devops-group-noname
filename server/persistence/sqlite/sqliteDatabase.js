const sqlite3 = require('sqlite3').verbose();
const config = require('../../configs');

const dbPath = config.sqlite.path;

/**
 * Instance of the Sqlite database.
 */


module.exports = new sqlite3.Database(dbPath, (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to the minitwit.db SQlite database.');
	return null;
});
