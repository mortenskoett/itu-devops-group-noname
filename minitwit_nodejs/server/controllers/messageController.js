'use strict'

/**
 * Controller handling message related requests.
 */

// TODO: Return correct HTTP error responses if null or whatever comes from service layer

const messageService = require('../services/messageService');

async function getAllMessages(req, res) {
    console.log('messageService.getAllMessages called.')
    let amount = (req.param.amount) ? req.param.amount : 50;
    let messages = await messageService.getAllMessages(amount);
    if (messages) {
        return messages;
    }
};

async function postMessage(req, res) {
    console.log('messageController.postMessage called.')

    // TODO: This code below should reside in viewcontroller
    // if (!req.session.loggedin) {
    //     res.status(401)
    //         .send({ url: req.originalUrl + ' : Unauthorized: user not logged in.' })
    //         .end();
    // };

    let message = req.body.message;
    let userId = req.session.userid;

    try {
        return await messageService.postMessage(userId, message);
    }
    catch (err) {
        console.log(err);
        res.status(401).send({ url: req.originalUrl + ` : ${err}` });
    };
};

async function getFollowedMessages(req, res) {
    console.log('messageController.postMessage called.')
    throw new Error('Not implemented');
}

module.exports = {
    getAllMessages,
    postMessage,
}