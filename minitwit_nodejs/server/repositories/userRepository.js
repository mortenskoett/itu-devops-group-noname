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
        throw new Error("Failed to get user from database: ", err);
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
        throw new Error("Failed to insert user into database: ", err);
    }
};

// TODO: Should be implemented and used to circumvent duplicate followings, which right now are happening
// /**
//  * Checks if followerID is following followedID.
//  * @param {int} followerID
//  * @param {int} followedID
//  */
// function following(followerID, followedID) {
//     return helper.getSingle(`select 1 from follower where follower.who_id = ? and follower.whom_id = ?`, [followerID, followedID]);
// };

/**
 * Makes followerID follow followedID.
 * @param {int} followerID
 * @param {int} followedID
 */
function follow(followerID, followedID) {
    try {
        return helper.insert(`insert into follower 
        (who_id, whom_id) values (?, ?)`, [followerID, followedID]);
    } catch (err) {
        throw new Error("Failed to insert follow into database: ", err);
    }
};

/**
 * Makes followerID unfollow followedID.
 * @param {int} followerID
 * @param {int} followedID
 */
function unfollow(followerID, followedID) {
    try {
        return helper.insert(`delete from follower 
        where who_id=? and whom_id=?`, [followerID, followedID]);
    } catch (err) {
        throw new Error("Failed to delete follow from database: ", err);
    }
};

/**
 * Get all users followed by followerID.
 * @param {int} followerID
 * @param {int} limit
 */
function getFollows(followerID, limit) {
    try {
        return helper.getAll(`SELECT user.username FROM user
        INNER JOIN follower ON follower.whom_id=user.user_id
        WHERE follower.who_id=?
        LIMIT ?`, [followerID, limit]);
    } catch (err) {
        throw new Error("Failed to get follows from database: ", err);
    }

};

module.exports = {
    getIdUsingPassword,
    getUserID,
    addUser,
    follow,
    unfollow,
    getFollows
};