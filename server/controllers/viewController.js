'use strict'

/**
 * Controller to handle interaction using views of the web application.
 * Endpoint: '/view/'
 */

const express = require('express');
const router = express.Router();
const messageService = require('../services/messageService');
const userService = require('../services/userService');

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

async function newMessageButton(req, res){
    console.log("newMessage called")

    // TODO: This code below should reside in viewcontroller
    // if (!req.session.loggedin) {
    //     res.status(401)
    //         .send({ url: req.originalUrl + ' : Unauthorized: user not logged in.' })
    //         .end();
    // };

    let message = req.body.message;
    let userId = req.session.userid;

    try {
        await messageService.postMessage(userId, message);

        res.redirect('/view/home');
    }
    catch (err) {
        console.log(err);
        res.status(401).send({ url: req.originalUrl + ` : ${err}` });
    };
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

async function renderPrivateTimeline(req, res) {
    console.log("renderPrivateTimeline called")

    if (!req.session.loggedin) {
        res.status(403).send({ url: req.originalUrl + ' : Unauthorized user not logged in.' });
    }

    let userId = req.session.userid;
    let followedMessages = await messageService.getFollowedMessages(userId, 30);

    if (!followedMessages) {
        res.status(500).send({ url: req.originalUrl + 'Error getting messages.' });
        res.end();
    }

    res.render('pages/timeline', {
        messages: followedMessages,
        loggedin: req.session.loggedin,
        username: req.session.username
    });
    res.end();
}

async function renderUserTimeline(req, res) {
    console.log("renderUserTimeline called")

    let username = req.params.username;
    let user = await userService.getUserID(username);
    let messages = await messageService.getUserMessages(user.id, 30);
    let following = await userService.following(req.session.userid, user.id);
    res.render('pages/user', {
        messages: messages,
        loggedin: req.session.loggedin,
        username: username,
        following: following
    });
    res.end();
}

async function renderLoginPage(req, res, next) {
    console.log("renderLoginPage called");
    res.render('pages/login');
}

async function renderSignupPage(req, res, next) {
    console.log("renderSignupPage called");
    res.render('pages/signup');
};


async function loginButton(req, res, next) {
    console.log("loginButton called");

    const user = req.body.username;
    const pass = req.body.password;

    if (!(user && pass)) {
        res.render('pages/login', {
            error: 'Please enter username and password'
        });
        res.end();
        return;
    }

    let isUserLoggedIn = await attemptLoginUser(req, user, pass);
    if (isUserLoggedIn) {
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

async function attemptLoginUser(request, username, password) {
    console.log("attemtLoginUser called");
    if (username && password) {
        let userIdRow = await userService.getIdUsingPassword(username, password);

        if (userIdRow) {
            updateSessionUserData(request, username, userIdRow.id);
            return userIdRow;
        }
    }
}

function updateSessionUserData(request, username, userId) {
    console.log("Userid:", userId);
    request.session.loggedin = true;
    request.session.username = username;
    request.session.userid = userId;
}

function logoutButton(req, res, next) {
    console.log('logoutButton called: ' + req.session.username);
    req.session.destroy();
    res.redirect('/view/public');
}

async function signupButton(req, res, next) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (!(username && password && email)) {
        res.render('pages/signup', {
            error: 'Please enter username, email and password'
        });
        res.end();
        return;
    }

    console.log('- Creating new user -');
    console.log('user: ' + username);
    console.log('email: ' + username);
    console.log('pass: ' + password);

    let existingUser = await userService.getUserID(username);

    if (existingUser) {
        res.render('pages/signup', {
            error: 'Username is invalid.'
        });
        res.end();
        return;
    }

    let isUserAdded = await userService.addUser(username, password, email);
    if (!isUserAdded) {
        res.render('pages/signup', {
            error: 'Adding user to database failed.'
        });
        res.end();
        return;
    }

    let isUserLoggedIn = await attemptLoginUser(req, username, password);
    if (isUserLoggedIn) {
        res.redirect('/view/home');
        res.end();
    }
    else {
        res.render('pages/signup', {
            error: 'Sign up failed'
        });
        res.end();
    }
}

async function followButton(req, res, next) {
    console.log('followButton called');

    if (!req.session.loggedin) {
        res.status(401).send({ url: req.originalUrl + ' : unautorized - user not followed.' });
    }
    let followerID = req.session.userid;

    let followedUsername = req.params.username;
    let followedID = await userService.getUserID(followedUsername);
    if (followedID == null) {
        res.status(404).send({ url: req.originalUrl + ' : was not found.' }); // Render page?
    }
    console.log("id: " + followerID + "now follows id: " + followedID.id);
    await userService.follow(followerID, followedID.id);

    res.redirect('/view/user/' + followedUsername);

}

async function unfollowButton(req, res, next) {
    console.log('unfollowButton called');

    if (!req.session.loggedin) {
        res.status(401).send({ url: req.originalUrl + ' : unautorized - user not unfollowed.' });
    }
    let followerID = req.session.userid;

    let followedUsername = req.params.username;
    let followedID = await userService.getUserID(followedUsername);
    if (followedID == null) {
        res.status(404).send({ url: req.originalUrl + ' : was not found.' }); // Render page?
    }
    console.log("id: " + followerID + "no longer follows id: " + followedID.id);
    await userService.unfollow(followerID, followedID.id);

    res.redirect('/view/user/' + followedUsername);  
}



module.exports = {
    router,
    mainView,
    renderPublicTimeLine,
    renderPrivateTimeline,
    renderUserTimeline,
    renderLoginPage,
    renderSignupPage,
    loginButton,
    logoutButton,
    signupButton,
    newMessageButton,
    followButton,
    unfollowButton
}