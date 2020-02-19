'use strict'

/**
 * Service handling message related business logic.
 */

const models = require('../persistence/models/models.js');
const Message = models.Message;
const User = models.User;
const Follower = models.Follower;
const Sequelize = require('sequelize');


/**
 * Get 'amount' messages from the database.
 * @param {int} amount 
 */
function getAllMessages(amount) {
    try {
        return Message.findAll({ 
            limit: amount,
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                attributes: ['username']
            }]
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
 * @param {int} userId
 * @param {int} amount 
 */
async function getFollowedMessages(userId, amount) {
    try {
        var ids = await Follower.findAll({where: {followerId: userId}, attributes: ['followedId']});
        var following_ids = ids.map(obj => { return obj.followedId });
        return Message.findAll({
            where: Sequelize.or(
                {userId: following_ids},
                {userId: userId}
            ),
            include: [ { model: User } ],
            order: [['createdAt', 'DESC']],
            limit: amount
        });
    }
    catch (err) {
        console.log(err);
    }
};

/**
 * Get user messages from userid
 * @param {int} userID
 * @param {int} amount 
 */
function getUserMessages(userID, amount) {
    try {
        return Message.findAll({
            limit: amount,
            order: [['createdAt', 'DESC']],
            where: {
                userId: userID
            },
            include: [{
                model: User
            }]
        });
    }
    catch (err) {
        console.log(err);
    }
};

module.exports = {
    getAllMessages,
    postMessage,
    getFollowedMessages,
    getUserMessages
}