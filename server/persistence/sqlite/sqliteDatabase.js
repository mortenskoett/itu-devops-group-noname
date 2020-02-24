'use strict'

const config = require('../../configs');
const db_path = config.sqlite.path;

/**
 * Instance of the Sqlite database.
 */

const sqlite3 = require('sqlite3').verbose();

module.exports = new sqlite3.Database(db_path, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the minitwit.db SQlite database.');
});