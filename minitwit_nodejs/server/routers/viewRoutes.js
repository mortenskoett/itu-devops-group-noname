'use strict'

/**
 * Routing to all views of the web application.
 * Endpoint: '/view/'
 */

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

/* Routes */

router.get('/main', mainView);
router.get('/public', renderPublicTimeLine);


/* Callbacks */

async function mainView(req, res, next) {
    console.log("mainview called")

    // User already logged in
    if (req.session.loggedin) {
        res.redirect('/home');
        res.end();
    }

    // Unkown user
    else {
        router.use(renderPublicTimeLine);
        next();
    }
}

async function renderPublicTimeLine(req, res) {
    console.log("renderPublicTimeline called")
    let allMessages = await messageController.getAllMessages(req, res);

    res.render('pages/timeline', {
        messages: allMessages,
        username: req.session.username,
        loggedin: req.session.loggedin
    });
}

module.exports = router;