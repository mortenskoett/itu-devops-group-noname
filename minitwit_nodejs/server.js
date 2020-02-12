/**
 * Main server instance.
 */

'use strict'

require('dotenv').config();
const config = require('./configs')();
const express = require('express');
const session = require('express-session');
const app = express();
const port = config.app.port;

// Using SQLite3. See https://github.com/mapbox/node-sqlite3
const sqlite3 = require('sqlite3').verbose();

module.exports.db = new sqlite3.Database('./data/minitwit.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the minitwit.db SQlite database.');
});

/* Repositories */
const messageRepository = require('./repositories/messageRepository');
const userRepository = require('./repositories/userRepository');

/* Before middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Using EJS. See https://github.com/mde/ejs/wiki/Using-EJS-with-Express
app.set('view engine', 'ejs');

/* Routing endpoints below*/

// Public or User timeline
app.get('/', async function (req, res) {

    // User already logged in
    if (req.session.loggedin) {
        res.redirect('/home');
        res.end();
    }

    // Unkown user
    else {
        res.redirect('/public');
        res.end();
    }
});

// For logged-in users
app.get('/home', async function (req, res) {
    if (!req.session.loggedin) {
        res.redirect('/public');
        res.end();
    }
    
    let userId = req.session.userid;
    console.log(userId);

    console.log('userId: ' + userId);
    let allMesages = await messageRepository.getFollowedMessages(userId, 30);

    console.log('messages: ' + allMesages.length);

    res.render('pages/timeline', {
        messages: allMesages,
        username: req.session.username
    });
    res.end();
});


// Public timeline
app.get('/public', async function (req, res) {
    let allMesages = await messageRepository.getAllMessages(30);
    res.render('pages/timeline', {
        messages: allMesages
    });
});

// User login page
app.get('/login', async function (req, res) {
    res.render('pages/login');
});

// User authorization
app.post('/login/auth', async function (req, res) {
    const user = req.body.username;
    var pass = req.body.password;

    if (user && pass) {
        console.log('user: ' + user);
        console.log('pass: ' + pass);
    
        let userId = await userRepository.getIdUsingPassword(user, pass);
        // let userId = await userRepository.getUserID(user);

        if (userId) {
            console.log('userid: ' + userId.user_id);
            req.session.loggedin = true;
            req.session.username = user;
            req.session.userid = userId.user_id;
            res.redirect('/home');       // TODO: Figure out logic to go to private timeline
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
});

// User signup page
app.get('/signup', async function (req, res) {
    res.render('pages/signup');
});

// User creation
app.post('/signup/create', async function (req, res) {
    const user = req.body.username;
    const email = req.body.email;
    var pass = req.body.password;

    if (user && pass && email) {
        console.log('- Creating new user -');
        console.log('user: ' + user);
        console.log('email: ' + user);
        console.log('pass: ' + pass);
    
        let existingUser = await userRepository.getUserID(user);
        if(existingUser){ 
            res.render('pages/signup', {
                error: 'Username is ivalid.'
            });
            res.end();
        }

        else{
            await userRepository.addUser(user, pass, email);
            
            // TODO Rest is almost identical to /login/auth - just different page renders
    
            let userId = await userRepository.getIdUsingPassword(user, pass);
    
            if (userId) {
                console.log('userid: ' + userId.user_id);
                req.session.loggedin = true;
                req.session.username = user;
                req.session.userid = userId.user_id;
                res.redirect('/home');
                res.end();
            }
            else {
                res.render('pages/signup', {
                    error: 'Sign up failed'
                });
                res.end();
            }
        }

    }
    else {
        res.render('pages/signup', {
            error: 'Please enter username, email and password'
        });
        res.end();
    }
});

// User timeline
app.get('/user/:username', async function (req, res) {
    let username = req.params.username;
    let userID = await userRepository.getUserID(username);
    if(userID == null) {
        res.status(404).send({url: req.originalUrl + ' : was not found.'}); // Render page?
    }
    console.log(userID.user_id);
    let allMessages = await messageRepository.getUserMessages(userID.user_id, 30);

    res.render('pages/timeline', {
        messages: allMessages
    });
});

// Follow
app.get('/user/follow/:username', async function (req, res) { //get?
    if (!req.session.loggedin) {
        res.status(401).send({url: req.originalUrl + ' : unautorized - user not unfollowed.'});
    }
    let followerID = req.session.userid;

    let followedUsername = req.params.username;
    let followedID = await userRepository.getUserID(followedUsername);
    if(followedID == null) {
        res.status(404).send({url: req.originalUrl + ' : was not found.'}); // Render page?
    }
    console.log("id: " + followerID + "now follows id: " + followedID.user_id);
    await userRepository.follow(followerID, followedID.user_id);

    res.redirect('/user/' + followedUsername);
});

// Unfollow
app.get('/user/unfollow/:username', async function (req, res) { //get?
    if (!req.session.loggedin) {
        res.status(401).send({url: req.originalUrl + ' : unautorized - user not unfollowed.'});
    }
    let followerID = req.session.userid;

    let followedUsername = req.params.username;
    let followedID = await userRepository.getUserID(followedUsername);
    if(followedID == null) {
        res.status(404).send({url: req.originalUrl + ' : was not found.'}); // Render page?
    }
    console.log("id: " + followerID + "no longer follows id: " + followedID.user_id);
    await userRepository.unfollow(followerID, followedID.user_id);

    res.redirect('/user/' + followedUsername);
});

/* After middleware */
app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' : was not found.' })
});

/* Start server */
app.listen(port, () => console.log(`Minitwit server listening on port ${port}.`));