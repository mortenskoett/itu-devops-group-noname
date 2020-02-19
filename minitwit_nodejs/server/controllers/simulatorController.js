'use strict'

/**
    Endpoints for simulator
*/
const timeUtil = require('../utilities/timeDateUtil');
const repository = require('../repositories/repository');
const userRepository = require('../repositories/userRepository');
const messageRepository = require('../repositories/messageRepository');

module.exports = {
    getLatest,
    register,
    getMessages,
    getUserMessages,
    postMessage,
    getFollows,
    setFollow
};

let repo = repository();
var LATEST = 0; // Latest recieved 'latest' value

function update_latest(req) {
    let { latest } = req.query;
    if (latest != -1) LATEST = parseInt(latest);
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

    if (!(username && pwd && email)) {
        res.status(400).send({ error_msg: "Missing username, password or email" });
        return;
    }

    let existingUser = await userRepository.getUserID(username);
    if (existingUser) {
        res.status(400).send({ error_msg: "Username already exists." });
        return;
    }

    let isUserAdded = await userRepository.addUser(username, pwd, email);
    if (!isUserAdded) {
        res.status(500).send({ error_msg: 'Adding user to database failed.' });
        return;
    }
    else {
        console.log('/register: New user created.');
        res.status(204).send();
    }
};

// @app.route("/msgs", methods=["GET"])
async function getMessages(req, res) {
    console.log("simulatorController: getMessages");
    update_latest(req);

    let no_messages = req.query.no ? req.query.no : 100;
    let allMessages = await messageRepository.getAllMessages(no_messages);

    if (!allMessages) {
        res.status(400).send({ error_msg: err });
        return;
    }

    let jsonMessages = allMessages.map(m => {
        return {
            "content": m.text,
            "pub_date": m.pub_date,
            "user": m.username
        }
    });

    // console.log("messages", messages) // TODO: The elements in the list is right, but the test fails for some reason !!
    // TODO: This seems to work correctly in e.g. Postman
    res.status(200).send(jsonMessages);
};

// @app.route("/msgs/<username>", methods=["GET", "POST"])
async function getUserMessages(req, res) {
    console.log("getUserMessages: ");
    update_latest(req)

    let { username } = req.params;
    let no_messages = req.query.no ? req.query.no : 100;

    let { user_id } = await userRepository.getUserID(username);
    if (!user_id) {
        res.status(404).send({ error_msg: "User id not found." });
        return;
    }

    let messages = await messageRepository.getUserMessages(user_id, no_messages);
    if (!messages) {
        res.status(500).send({ error_msg: "Database error encountered." });
        return;
    }

    let jsonMessages = messages.map(m => {
        return {
            "content": m.text,
            "pub_date": m.pub_date,
            "user": m.username
        }
    });

    res.status(200).send(jsonMessages);
};

async function postMessage(req, res) {
    update_latest(req)

    let { content } = req.body;
    let { username } = req.params
    let date = timeUtil.getFormattedDate();

    console.log(content, username, date);

    let { user_id } = await userRepository.getUserID(username);
    if (!user_id) {
        res.status(404).send({ error_msg: `Error finding user "${username}"` });
        return;
    }

    let isSuccess = await messageRepository.postMessage(user_id, content, date);
    if (!isSuccess) {
        res.status(404).send({ error_msg: "Error posting message." });
        return;
    }

    res.status(204).send();
};

// @app.route("/fllws/<username>", methods=["GET", "POST"])
async function getFollows(req, res) {
    console.log("getFollows: ");
    update_latest(req)

    let no_messages = req.query.no ? req.query.no : 100;

    let follows = await repo.getFollows(req.params.username, no_messages);
    if (!follows) {
        res.status(400).send({ error_msg: "A database error occurred." });
        return;
    }

    let jsonFollows = follows.map(e => e.username);

    res.status(200).send({ follows: jsonFollows }) // contains the right result, but test says it is the wrong types
};

// TODO: Does not seems to work -- maybe data issue in db
async function setFollow(req, res) {
    console.log("setFollow: ");
    update_latest(req)

    let { follow, unfollow } = req.body;
    if (!(follow || unfollow)) {
        console.error("Follow was called without neither 'follow' or 'unfollow' parameter")
        res.sendStatus(400);
    }

    let { username } = req.params;

    let user = await userRepository.getUserID(username);
    let userId = user.user_id;
    if (!userId) {
        res.status(400).send({ error_msg: `Error finding user "${username}"` });
        return;
    }

    if (follow) {
        let otherUser = await userRepository.getUserID(follow);
        let otherUserId = otherUser.user_id;
        if (!otherUserId) {
            res.status(404).send({ error_msg: `Error finding user "${username}"` });
            return;
        }

        await userRepository.follow(userId, otherUserId);
        console.log(userId, otherUserId);
    }
    else if (unfollow) {
        let otherUser = await userRepository.getUserID(unfollow);
        let otherUserId = otherUser.user_id;
        if (!otherUserId) {
            res.status(404).send({ error_msg: `Error finding user "${username}"` });
            return;
        }

        await userRepository.unfollow(userId, otherUserId);
        console.log(userId, otherUserId);
    }
    res.sendStatus(204);
};
