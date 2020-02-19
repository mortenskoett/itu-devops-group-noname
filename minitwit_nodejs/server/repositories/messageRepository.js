'use strict'

/**
 * Service handling message related business logic.
 */

const helper = require('../persistence/sqlite/sqliteDatabaseHelper');


/**
 * Get 'amount' messages from the database.
 * @param {int} amount 
 */
function getAllMessages(amount) {
    try {
        return helper.getAll(`select message.*, user.* from message, user
                where message.author_id = user.user_id
                order by message.pub_date desc limit ?`, [amount]);
    } catch (err) {
        console.log(err);
    }
};

/**
 * Add a new message
 * @param {int} userID
 * @param {string} text 
 * @param {int} date
 */
function postMessage(userID, text, date) {
    try {
        helper.insert(`insert into message 
        (author_id, text, pub_date) values (?, ?, ?)`, [userID, text, date]);
        return userID;  // TODO: Might not be best approach
    }
    catch (err) {
        console.log(err);
    }
};

/**
 * Gets up to 'amount' messsages written by users followed by given 'user_id'.
 * @param {int} user_id
 * @param {int} amount 
 */
function getFollowedMessages(user_id, amount) {
    try {
        return helper.getAll(`select message.*, user.* from message, user 
        where message.author_id = user.user_id and (user.user_id = ? 
        or user.user_id in (select whom_id from follower where who_id = ?)) 
        order by message.pub_date desc limit ?`, [user_id, user_id, amount])
    }
    catch (err) {
        console.log("sqliteDatabaseHelper: " + err);
    }
};

/**
 * Get user messages from userid
 * @param {int} userID
 * @param {int} amount 
 */
function getUserMessages(userID, amount) {
    try {
        return helper.getAll(`select message.*, user.* from message, user
        where message.author_id = user.user_id and (user.user_id = ?)
        order by message.pub_date desc limit ?`, [userID, amount])
    }
    catch (err) {
        console.log("sqliteDatabaseHelper: " + err);
    }
};

module.exports = {
    getAllMessages,
    postMessage,
    getFollowedMessages,
    getUserMessages
}