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
const simulator = express();
const simPort = config.simulator.port;
const simRouter = require('./routers/simulatorRoutes');

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

/* Start server */
app.listen(port, () => console.log(`Minitwit server listening on port ${port}.`));


/* 
=======================================
SIMULATOR
=======================================
*/
simulator.use(express.json());
simulator.use(express.urlencoded({ extended: true }));
simulator.use(express.static('static')); // needed ?
simulator.use(session({ // needed?
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

simulator.use('/', simRouter)
simulator.listen(simPort, () => console.log(`Simulator server listening on port ${simPort}.`));