'use strict'

/**
 * Controller to handle interaction using views of the web application.
 * Endpoint: '/view/'
 */

const express = require('express');
const router = express.Router();
const messageService = require('../services/messageService');
const userService = require('../services/userService');

/* Routes */
router.get('/', mainView);
router.get('/login', renderLoginPage);
router.post('/login/auth', loginButton);
router.get('/home', renderUserTimeline);

async function mainView(req, res, next) {
    console.log("mainview called")

    // User already logged in
    if (req.session.loggedin) {
        res.redirect('/home');      // TODO: Should be similar to the else clause
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

    let amount = (req.param.amount) ? req.param.amount : 50;

    let allMessages = await messageService.getAllMessages(amount);

    if (!allMessages) {
        res.status(500).send({ url: req.originalUrl + 'Error getting messages.' });
        res.end();
    }

    res.render('pages/timeline', {
        messages: allMessages,
        username: req.session.username,
        loggedin: req.session.loggedin
    });
}

async function renderUserTimeline(req, res) {
    console.log("renderUserTimeline called")

    let userId = req.session.userid;
    let followedMessages = await messageService.getFollowedMessages(userId, 30);
    res.render('pages/timeline', {
        messages: followedMessages,
        loggedin: req.session.loggedin,
        username: req.session.username
    });
    res.end();
}

async function renderLoginPage(req, res, next) {
    console.log("renderLoginPage called");
    res.render('pages/login');
}

async function loginButton(req, res, next) {
    console.log("loginButton called");

    const user = req.body.username;
    const pass = req.body.password;

    if (user && pass) {
        let userIdRow = await userService.getIdUsingPassword(user, pass);

        if (userIdRow) {
            console.log('userid: ' + userIdRow.user_id);
            updateSessionUserData(req, userIdRow.user_id);
            res.redirect('/');
            res.end();
        }
        else {
            res.render('pages/login', {
                error: 'Incorrect username or password.'
            });
            res.end();
        }
    }
    else {
        res.render('pages/login', {
            error: 'Please enter username and password'
        });
        res.end();
    }
}

function updateSessionUserData(req, userId) {
    req.session.loggedin = true;
    req.session.username = req.body.username;
    req.session.userid = userId;
}

module.exports = router;
