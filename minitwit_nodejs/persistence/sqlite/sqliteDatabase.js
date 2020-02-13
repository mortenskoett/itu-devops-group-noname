'use strict'

const sqlite3 = require('sqlite3').verbose();

module.exports = new sqlite3.Database('./persistence/sqlite/minitwit.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the minitwit.db SQlite database.');
});