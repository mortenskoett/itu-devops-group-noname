'use strict'

/**
 * Service handling user related business logic.
 */

const models = require('../persistence/models/models.js');
const User = models.User;
const Follower = models.Follower;

/**
 * Authenticate user using username and password.
 * @param {string} username 
 * @param {string} password 
 */
function getIdUsingPassword(username, password) {
    try {
        return User.findOne({
            where: {username: username, password: password}
        });
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
        return User.findOne({
            where: {username: username}
        });
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
        return User.create({username: username, email: email, password: password});
    }
    catch (err) {
        throw new Error("Failed to insert user into database: ", err);
    }
};

/**
 * Checks if followerID is following followedID.
 * @param {int} followerID
 * @param {int} followedID
 */
function following(followerID, followedID) {
    try {
        return Follower.findOne({
            where: {followerId: followerID, followedId: followedID}
        });
    }
    catch (err) {
        console.log(err);
    }
};

/**
 * Makes followerID follow followedID.
 * @param {int} followerID
 * @param {int} followedID
 */
function follow(followerID, followedID) {
    try {
        return Follower.create({followerId: followerID, followedId: followedID});
    }
    catch (err) {
        console.log(err);
    }
};

/**
 * Get all users followed by followerID.
 * @param {int} followerID
 * @param {int} limit
 */
function getFollows(followerID, limit) {
    try {
        return Follower.findAll({
            limit: limit,
            where: {followerId: followerID},
            include: [{
                model: User,
                as: "fllwed",
                attributes: ['username']
            }]
        });
        // return helper.getAll(`SELECT user.username FROM user
        // INNER JOIN follower ON follower.whom_id=user.user_id
        // WHERE follower.who_id=?
        // LIMIT ?`, [followerID, limit]);
    } catch (err) {
        throw new Error("Failed to get follows from database: ", err);
    }
};

/**
 * Makes followerID unfollow followedID.
 * @param {int} followerID
 * @param {int} followedID
 */

function unfollow(followerID, followedID) {
    try {
        return Follower.destroy({
            where: {
                followerId: followerID,
                followedId: followedID
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

module.exports = {
    getIdUsingPassword,
    getUserID,
    addUser,
    follow,
    unfollow,
    getFollows,
    following
}
