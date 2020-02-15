'use strict'

/**
 * Handling and accessing the Sqlite database.
 */

const db = require('./sqliteDatabase');

function getAll(query, params) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                console.error(err.message);
                reject();
            }
            resolve(rows);
        });
    });
}

function insert(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err, rows) => {
            if(err) {
                console.error(err.message);
                reject();
            }
            resolve(rows);
        }); 
    });
}

function getSingle(query, params) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                console.error(err.message);
                reject();
            }
            resolve(row);
        });
    });
}

module.exports = {
    getAll,
    getSingle,
    insert
}