'use strict'

/**
 * Service handling user related business logic.
 */

const helper = require('../persistence/sqlite/sqliteDatabaseHelper');

/**
 * 
 * @param {string} username 
 * @param {string} password 
 */
function getIdUsingPassword(username, password) {
    try {
        return helper.getSingle(
            `select user.user_id from user 
                where user.username = ? 
                and user.pw_hash = ?`, [username, password]);
    }
    catch (err) {
        console.log(err);
    }
};

module.exports = {
    getIdUsingPassword
}