'use strict'

/**
 * Controller handling message related requests.
 */

const messageService = require('../services/messageService');

async function getAllMessages(req, res) {
    console.log('getAllMessages called.')
    let amount = (req.param.amount) ? req.param.amount : 50;
    return await messageService.getAllMessages(amount);
};

async function postMessage(req, res) {
    console.log('/message/postmessage called.')

    if (!req.session.loggedin) {
        res.status(401).send({ url: req.originalUrl + ' : Unauthorized: user not logged in.' });
    };

    let message = req.body.message;
    let userId = req.session.userid;

    await messageService.postMessage(userId, message);
};

module.exports = {
    getAllMessages,
    postMessage
}