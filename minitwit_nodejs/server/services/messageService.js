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
    return helper.getAll(`select message.*, user.* from message, user
                where message.author_id = user.user_id
                order by message.pub_date desc limit ?`, [amount])
};

/**
 * Add a new message
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
    postMessage
}