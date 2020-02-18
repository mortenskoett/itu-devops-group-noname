'use strict'

/**
 * Service handling message related business logic.
 */

const models = require('../persistence/models/models.js');
const Message = models.getMessageModel();
const User = models.getUserModel();
//const sequelize = models.getSequelize();

/**
 * Get 'amount' messages from the database.
 * @param {int} amount 
 */
function getAllMessages(amount) {
    try {
        return Message.findAll({ 
            limit: amount,
            include: [{
                model: User,
                attributes: ['username']

            }]
            //order: sequelize.fn('max', sequelize.col('createdAt')) 
        });
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
        return Message.create({userId: userID, text: text})
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
        return Message.findAll({
            limit: amount,
            include: [{// Notice `include` takes an ARRAY
                model: User
            }]
            //order: sequelize.fn('max', sequelize.col('createdAt'))
        });
    }
    catch (err) {
        console.log("sqliteDatabaseHelper: " + err);
    }
};

// TODO: Should be implemented
// /**
//  * Get amount messages from the database.
//  * @param {int} userID
//  * @param {int} amount 
//  */
// function getUserMessages(userID, amount) {
//     return helper.getAll(`select message.*, user.* from message, user
//                 where message.author_id = user.user_id and (user.user_id = ?)
//                 order by message.pub_date desc limit ?`, [userID, amount])
// };

module.exports = {
    getAllMessages,
    postMessage,
    getFollowedMessages
}