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
router.get('/view/public', renderPublicTimeLine);
router.get('/view/home', renderUserTimeline);
router.get('/view/login', renderLoginPage);
router.post('/view/login/auth', loginButton);
router.get('/view/logout', logoutButton);

async function mainView(req, res, next) {
    console.log("mainview called")

    // User already logged in
    if (req.session.loggedin) {
        console.log('/view/home')
        res.redirect('/view/home');
    }

    // Unkown user
    else {
        console.log('/view/public')
        res.redirect('/view/public');
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

    if (!req.session.loggedin) {
        res.status(403).send({ url: req.originalUrl + ' : Unauthorized user not logged in.' });
    }

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

async function logoutButton(req, res, next) {
    console.log('logoutButton called: ' + req.session.username);
    req.session.destroy();
    res.redirect('/view/public');
}

async function loginButton(req, res, next) {
    console.log("loginButton called");

    const user = req.body.username;
    const pass = req.body.password;

    if (user && pass) {
        let userIdRow = await userService.getIdUsingPassword(user, pass);

        if (userIdRow) {
            console.log('userid: ' + userIdRow.user_id);
            req.session.loggedin = true;
            req.session.username = user;
            req.session.userid = userIdRow.user_id;
            res.redirect('/view/home')
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

module.exports = router;