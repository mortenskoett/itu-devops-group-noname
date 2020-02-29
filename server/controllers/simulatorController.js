'use strict'

/**
    Endpoints for simulator
*/
const timeUtil = require('../utilities/timeDateUtil');
const db = require('../persistence/models/models');

module.exports = {
    getLatest,
    register,
    getMessages,
    getUserMessages,
    postMessage,
    getFollows,
    setFollow
};

var LATEST = 0; // Latest recieved 'latest' value

function update_latest(req) {
    let { latest } = req.query;
    if (latest != -1) LATEST = parseInt(latest);
}

async function validate(username, pwd, email) {
    if (!username) return "You have to enter a username"
    else if (!email /* && !contains @ */) return "You have to enter a valid email address"
    else if (!pwd) return "You have to enter a password"
    let user = await db.User.findOne({ where: {username: username} });
    if (user) return "Username already exists."
    return null
}

// Get latest value (stored for each api request)
// @app.route("/latest", methods=["GET"]) 
async function getLatest(req, res) {
    res.status(200).send({ latest: LATEST })
};

// @app.route("/register", methods=["POST"]) 
async function register(req, res) {
    update_latest(req);

    let { username, email, pwd } = req.body;
    
    let err = await validate(username, pwd, email);
    if (err) {
        res.status(400).send({ error_msg: err });
        return;
    }

    let isUserAdded = await db.User.create({username, password: pwd, email});
    if (!isUserAdded) {
        res.status(500).send({ error_msg: 'Adding user to database failed.' });
        return;
    }

    console.log('/register: New user created, named: ', username);
    res.status(404).send();
};

// @app.route("/msgs", methods=["GET"])
async function getMessages(req, res) {
    console.log("simulatorController: getMessages");
    update_latest(req);

    let no_messages = req.query.no ? req.query.no : 100;

    let allMessages = await db.Message.findAll({ 
        limit: no_messages,
        order: [['createdAt', 'DESC']],
        include: [db.User]
        // where: { flagged: false }
    })

    let jsonMessages = allMessages.map(m => {
        return {
            "content": m.text,
            "pub_date": m.createdAt,
            "user": m.user.username
        }
    });

    res.status(200).send(jsonMessages);
};

// @app.route("/msgs/<username>", methods=["GET", "POST"])
async function getUserMessages(req, res) {
    console.log("getUserMessages: ");
    update_latest(req)

    let no_messages = req.query.no ? req.query.no : 100;

    let user = await db.User.findOne({ where: {username: req.params.username} });
    if (!user) {
        res.status(404).send({ error_msg: "User id not found." });
        return;
    }

    let messages = await user.getMessages({
        limit: no_messages,
        order: [['createdAt', 'DESC']],
        include: [db.User]
        // where: { flagged: false }
    });

    let jsonMessages = messages.map(m => {
        return {
            "content": m.text,
            "pub_date": m.createdAt,
            "user": m.user.username
        }
    });

    res.status(200).send(jsonMessages);
};

async function postMessage(req, res) {
    console.log("posting message");

    update_latest(req)
    let username = req.params.username;
    let date = timeUtil.getFormattedDate();

    let user = await db.User.findOne({ where: {username: username} });
    if (!user) {
        res.status(404).send({ error_msg: `Error finding user "${username}"` });
        return;
    }
    let msg = await user.createMessage({ text: req.body.content, date });
    if (!msg) console.log("ERROR CREATING MESSAGE")
    
    res.status(204).send();
};

// @app.route("/fllws/<username>", methods=["GET", "POST"])
async function getFollows(req, res) {
    console.log("getFollows: ");
    update_latest(req)

    let username = req.params.username;
    let no_messages = req.query.no ? req.query.no : 100;

    let user = await db.User.findOne({ where: {username: username} });
    if (!user) {
        res.status(404).send({ error_msg: `Error finding user "${username}"` });
        return;
    }

    let follows = await user.getFollowers({limit: no_messages});

    let jsonFollows = follows.map(e => e.dataValues.username);

    res.status(200).send({ follows: jsonFollows }) // contains the right result, but test says it is the wrong types
};

// TODO: Does not seems to work -- maybe data issue in db
async function setFollow(req, res) {
    console.log("Called setFollow");
    update_latest(req)

    let { follow, unfollow } = req.body;
    if (!(follow || unfollow)) {
        console.error("Follow was called without neither 'follow' or 'unfollow' parameter")
        res.sendStatus(400);
    }
 
    let { username } = req.params;

    let user = await db.User.findOne({ where: {username: username} });
    if (!user) {
        res.status(400).send({ error_msg: `Error finding user "${username}"` });
        return;
    }

    if (follow) {
        let otherUser = await db.User.findOne({ where: {username: follow} });
        if (!otherUser) {
            res.status(400).send({ error_msg: `Error finding user "${username}"` });
            return;
        }
        await user.addFollower(otherUser);
    }
    else if (unfollow) {
        let otherUser = await db.User.findOne({ where: {username: unfollow} });
        if (!otherUser) {
            res.status(400).send({ error_msg: `Error finding user "${username}"` });
            return;
        }

        await user.removeFollowers(otherUser);
    }
    res.sendStatus(204);
};
