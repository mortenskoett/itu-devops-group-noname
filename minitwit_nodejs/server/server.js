/**
 * Main server instance.
 */

'use strict'

require('dotenv').config();
const config = require('./configs');
const express = require('express');
const session = require('express-session');
const app = express();
const port = config.app.port;
const baseRouter = require('./routers/baseRoutes');

/* Repositories */
// const messageRepository = require('./repositories/messageRepository');
// const userRepository = require('./repositories/userRepository');

/* Before middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


/* 
=======================================
END POINT ROUTING VERTICAL SLICE START: 
=======================================
*/

// app.use('/', (req, res) => res.send("App is working"));
app.use('/', baseRouter);


/* 
=======================================
NOT YET REFACTORED BELOW:
=======================================
*/

// // User signup page
// app.get('/signup', async function (req, res) {
//     res.render('pages/signup');
// });

// // User creation
// app.post('/signup/create', async function (req, res) {
//     const user = req.body.username;
//     const email = req.body.email;
//     var pass = req.body.password;

//     if (user && pass && email) {
//         console.log('- Creating new user -');
//         console.log('user: ' + user);
//         console.log('email: ' + user);
//         console.log('pass: ' + pass);

//         let existingUser = await userRepository.getUserID(user);
//         if (existingUser) {
//             res.render('pages/signup', {
//                 error: 'Username is ivalid.'
//             });
//             res.end();
//         }

//         else {
//             await userRepository.addUser(user, pass, email);

//             // TODO Rest is almost identical to /login/auth - just different page renders

//             let userId = await userRepository.getIdUsingPassword(user, pass);

//             if (userId) {
//                 console.log('userid: ' + userId.user_id);
//                 req.session.loggedin = true;
//                 req.session.username = user;
//                 req.session.userid = userId.user_id;
//                 res.redirect('/home');
//                 res.end();
//             }
//             else {
//                 res.render('pages/signup', {
//                     error: 'Sign up failed'
//                 });
//                 res.end();
//             }
//         }

//     }
//     else {
//         res.render('pages/signup', {
//             error: 'Please enter username, email and password'
//         });
//         res.end();
//     }
// });


// // Follow
// app.get('/user/follow/:username', async function (req, res) { //get?
//     if (!req.session.loggedin) {
//         res.status(401).send({ url: req.originalUrl + ' : unautorized - user not followed.' });
//     }
//     let followerID = req.session.userid;

//     let followedUsername = req.params.username;
//     let followedID = await userRepository.getUserID(followedUsername);
//     if (followedID == null) {
//         res.status(404).send({ url: req.originalUrl + ' : was not found.' }); // Render page?
//     }
//     console.log("id: " + followerID + "now follows id: " + followedID.user_id);
//     await userRepository.follow(followerID, followedID.user_id);

//     res.redirect('/user/' + followedUsername);
// });

// // Unfollow
// app.get('/user/unfollow/:username', async function (req, res) { //get?
//     if (!req.session.loggedin) {
//         res.status(401).send({ url: req.originalUrl + ' : unautorized - user not unfollowed.' });
//     }
//     let followerID = req.session.userid;

//     let followedUsername = req.params.username;
//     let followedID = await userRepository.getUserID(followedUsername);
//     if (followedID == null) {
//         res.status(404).send({ url: req.originalUrl + ' : was not found.' }); // Render page?
//     }
//     console.log("id: " + followerID + "no longer follows id: " + followedID.user_id);
//     await userRepository.unfollow(followerID, followedID.user_id);

//     res.redirect('/user/' + followedUsername);
// });

// // Post message
// app.post('/user/postmessage', async function (req, res) {
//     console.log('/user/postmessage called.')

//     if (!req.session.loggedin) {
//         res.status(401).send({ url: req.originalUrl + ' : unautorized - user not logged in.' });
//     }

//     let message = req.body.message;
//     let userId = req.session.userid;

//     await messageRepository.postMessage(userId, message);
//     res.redirect('/home')
// });

// /* After middleware */
// app.use(function (req, res) {
//     res.status(404).send({ url: req.originalUrl + ' : was not found.' })
// });

/* Start server */
app.listen(port, () => console.log(`Minitwit server listening on port ${port}.`));