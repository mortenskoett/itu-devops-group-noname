'use strict'

/**
 * Controller handling user related requests.
 */

const userService = require('../services/userService');

// Check if username/password are valid in which case session data is set accordingly.
async function checkUserCredentials(req, res, next) {       // TODO: Example controller method! Not used by UI.
    console.log('loginUser called.')

    const user = req.body.username;
    var pass = req.body.password;

    if (user && pass) {
        console.log('user: ' + user);
        console.log('pass: ' + pass);

        let userId = await userService.getIdUsingPassword(user, pass);

        if (userId) {
            console.log('userid: ' + userId.user_id);
            res.status(200).send({ userid: userId.user_id });
            next();
        }
        else {
            res.status(403).send({ error: 'Username and password is not a match.' });
        }
    }
    res.status(400).send({ error: 'Username or password missing.' });
};

module.exports = {
    checkUserCredentials
}