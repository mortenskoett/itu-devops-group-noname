'use strict'

/**
 * Controller handling message related requests.
 */

// TODO: Return correct HTTP error responses if null or whatever comes from service layer

const messageService = require('../services/messageService');

async function getAllMessages(req, res) {
    console.log('getAllMessages called.')
    let amount = (req.param.amount) ? req.param.amount : 50;
    try {
        return await messageService.getAllMessages(amount);
    }
    catch (err) {
        console.log(err);
        res.status(401).send({ url: req.originalUrl + ` : ${err}` });
    };
};

async function postMessage(req, res) {
    console.log('messageController::postMessage called.')

    if (!req.session.loggedin) {
        res.status(401)
            .send({ url: req.originalUrl + ' : Unauthorized: user not logged in.' })
            .end();
    };

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

module.exports = {
    getAllMessages,
    postMessage
}