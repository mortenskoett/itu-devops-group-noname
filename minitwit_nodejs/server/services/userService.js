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

// TODO: Should be implemented
// /**
//  * Checks if followerID is following followedID.
//  * @param {int} followerID
//  * @param {int} followedID
//  */
// function following(followerID, followedID) {
//     return helper.getSingle(`select 1 from follower where follower.who_id = ? and follower.whom_id = ?`, [followerID, followedID]);
// };

// /**
//  * Makes followerID follow followedID.
//  * @param {int} followerID
//  * @param {int} followedID
//  */
// function follow(followerID, followedID) {
//     return helper.insert(`insert into follower 
//         (who_id, whom_id) values (?, ?)`, [followerID, followedID]);
// };

// /**
//  * Makes followerID unfollow followedID.
//  * @param {int} followerID
//  * @param {int} followedID
//  */
// function unfollow(followerID, followedID) {
//     return helper.insert(`delete from follower 
//         where who_id=? and whom_id=?`, [followerID, followedID]);
// };

module.exports = {
    getIdUsingPassword,
    getUserID,
    addUser
}