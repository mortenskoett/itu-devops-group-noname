
/**
 * Service handling message related business logic.
 */

const Sequelize = require('sequelize');
const models = require('../persistence/models/models.js');

const { Message } = models;
const { User } = models;
const { Follower } = models;


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
        attributes: ['username'],
      }],
    });
  } catch (err) {
    throw new Error('Failed to get messages from database: ', err);
  }
}

/**
 * Add a new message
 * @param {int} userID
 * @param {string} text
 * @param {int} date
 */
function postMessage(userID, text) {
  try {
    return Message.create({ userId: userID, text });
  } catch (err) {
    throw new Error('Failed to save message in database: ', err);
  }
}

/**
 * Gets up to 'amount' messsages written by users followed by given 'user_id'.
 * @param {int} userId
 * @param {int} amount
 */
async function getFollowedMessages(userId, amount) {
  try {
    const ids = await Follower.findAll({ where: { followerId: userId }, attributes: ['followedId'] });
    const followingIDs = ids.map((obj) => obj.followedId);
    return Message.findAll({
      where: Sequelize.or(
        { userId: followingIDs },
        { userId },
      ),
      include: [{ model: User }],
      order: [['createdAt', 'DESC']],
      limit: amount,
    });
  } catch (err) {
    throw new Error('Failed to get messages from database: ', err);
  }
}

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
        userId: userID,
      },
      include: [{
        model: User,
      }],
    });
  } catch (err) {
    throw new Error('Failed to get messages from database: ', err);
  }
}

module.exports = {
  getAllMessages,
  postMessage,
  getFollowedMessages,
  getUserMessages,
};
