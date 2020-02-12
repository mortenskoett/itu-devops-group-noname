'use strict'

const helper = require('./databaseHelper')

/**
 * Get amount messages from the database.
 * @param {int} amount 
 */
function getAllMessages(amount) {
    return helper.getAll(`select message.*, user.* from message, user
                where message.author_id = user.user_id
                order by message.pub_date desc limit ?`, [amount])
};

/**
 * Get amount messages from the database.
 * @param {int} user_id
 * @param {int} amount 
 */
function getFollowedMessages(user_id, amount) {
    return helper.getAll(`select message.*, user.* from message, user 
    where message.author_id = user.user_id and (user.user_id = ? 
        or user.user_id in (select whom_id from follower where who_id = ?)) 
        order by message.pub_date desc limit ?`, [user_id, user_id, amount])
};

/**
 * Get amount messages from the database.
 * @param {int} userID
 * @param {int} amount 
 */
function getUserMessages(userID, amount) {
    return helper.getAll(`select message.*, user.* from message, user
                where message.author_id = user.user_id and (user.user_id = ?)
                order by message.pub_date desc limit ?`, [userID, amount])
};

/**
 * Add message
 * @param {int} userID
 * @param {string} text 
 * @param {int} date
 */
function postMessage(userID, text, date) {
    return helper.insert(`insert into message 
    (author_id, text, pub_date) values (?, ?, ?)`, [userID, text, date])
};

module.exports = {
    getAllMessages,
    getFollowedMessages,
    getUserMessages,
    postMessage
}