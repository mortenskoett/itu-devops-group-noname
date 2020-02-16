'use strict'

/**
 * Service handling user related business logic.
 */

const helper = require('../persistence/sqlite/sqliteDatabaseHelper');

/**
 * Authenticate user using username and password.
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

/**
 * Get user id from username.
 * @param {string} username
 */
function getUserID(username) {
    try {
        return helper.getSingle(`select user.user_id from user where user.username = ?`, [username]);
    }
    catch (err) {
        console.log(err);
    }
};

/**
 * Adds a user to the database.
 * @param {string} username
 * @param {string} password
 * @param {string} email
 */
function addUser(username, password, email) {
    try {
        helper.insert(`insert into user (username, pw_hash, email) values (?, ?, ?)`, [username, password, email]);
        return getUserID(username);
    }
    catch (err) {
        console.log(err);
    }
};

module.exports = {
    getIdUsingPassword,
    getUserID,
    addUser
}