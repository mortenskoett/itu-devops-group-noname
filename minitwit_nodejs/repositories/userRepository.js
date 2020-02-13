'use strict'

const helper = require('../persistence/sqlite/sqliteDatabaseHelper');

 /**
  * 
  * @param {string} username 
  * @param {string} password 
  */
function getIdUsingPassword(username, password) {
    return helper.getSingle(`select user.user_id from user where user.username = ? and user.pw_hash = ?`, [username, password]);
};

/**
 * Get amount messages from the database.
 * @param {string} username
 */
function getUserID(username) {
    return helper.getSingle(`select user.user_id from user where user.username = ?`, [username]);
};

/**
 * Adds a user to the db.
 * @param {string} username
 * @param {string} password
 * @param {string} email
 */
function addUser(username, password, email) {
    return helper.insert(`insert into user (username, pw_hash, email) values (?, ?, ?)`, [username, password, email]);
};

/**
 * Checks if followerID is following followedID.
 * @param {int} followerID
 * @param {int} followedID
 */
function following(followerID, followedID) {
    return helper.getSingle(`select 1 from follower where follower.who_id = ? and follower.whom_id = ?`, [followerID, followedID]);
};

/**
 * Makes followerID follow followedID.
 * @param {int} followerID
 * @param {int} followedID
 */
function follow(followerID, followedID) {
    return helper.insert(`insert into follower 
        (who_id, whom_id) values (?, ?)`, [followerID, followedID]);
};

/**
 * Makes followerID unfollow followedID.
 * @param {int} followerID
 * @param {int} followedID
 */
function unfollow(followerID, followedID) {
    return helper.insert(`delete from follower 
        where who_id=? and whom_id=?`, [followerID, followedID]);
};

module.exports = {
    getUserID,
    follow,
    unfollow,
    getIdUsingPassword,
    addUser,
    following
}