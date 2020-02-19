'use strict'

/**
    Endpoints for simulator
*/
const timeUtil = require('../utilities/timeDateUtil');
const repository = require('../services/repository');

module.exports = {
    getLatest, 
    register,
    getMessages,
    getUserMessages,
    postMessage,
    getFollows,
    editFollow
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
    res.status(200).json({'latest': LATEST})
};

// @app.route("/register", methods=["POST"]) 
async function register(req, res) {
    update_latest(req);
    let {username, email, pwd} = req.body;
    try {
        await repo.createUser(username, pwd, email);
        res.status(204).json("");
    } catch (err) {
        res.status(400).json({"status": 400, "error_msg": err});
    }
};

// @app.route("/msgs", methods=["GET"])
async function getMessages(req, res) {
    console.log("getMessages: ");
    update_latest(req);

    // not_from_sim_response = not_req_from_simulator(request)      // TODO: MISSING IN ALL FUNCTIONS!!!
    // if not_from_sim_response:
    //     return not_from_sim_response

    let no_messages = req.query.no ? req.query.no : 100;
    let messages;
    try {
        messages = await repo.getAllMessages(no_messages);
        messages = messages.map(e => { return {
            "content" : e.text,
            "pub_date": e.pub_date,
            "user": e.username
        }});
        // console.log("messages", messages) // TODO: The elements in the list is right, but the test fails for some reason !!
        res.status(200).json(messages);
    } catch (err) {
        res.status(400).json({"status": 400, "error_msg": err});
    }
};

// @app.route("/msgs/<username>", methods=["GET", "POST"])
async function getUserMessages(req, res) {
    console.log("getUserMessages: ");
    update_latest(req)

    // not_from_sim_response = not_req_from_simulator(request)
    // if not_from_sim_response:
    //     return not_from_sim_response

    let no_messages = req.query.no ? req.query.no : 100;
    let messages;
    try {
        messages = await repo.getMessagesPerUser(req.params.username, no_messages);
        res.status(200).json(messages);
    } catch (err) {
        res.status(400).json({"status": 400, "error_msg": err});
    }
};

async function postMessage(req, res) {
    update_latest(req)

    // not_from_sim_response = not_req_from_simulator(request)
    // if not_from_sim_response:
    //     return not_from_sim_response

    let {content} = req.body;
    let {username} = req.params

    try {
        await repo.postMessageAsUser(username, content, timeUtil.getFormattedDate());
        res.status(204).json("");
    } catch (err) {
        res.status(400).json({"status": 400, "error_msg": err});
    }
};

// @app.route("/fllws/<username>", methods=["GET", "POST"])
async function getFollows(req, res) {
    console.log("getFollows: ");
    update_latest(req)

    // not_from_sim_response = not_req_from_simulator(request)
    // if not_from_sim_response:
    //     return not_from_sim_response

    let no_messages = req.query.no ? req.query.no : 100;
    let follows;
    try {
        follows = await repo.getFollows(req.params.username, no_messages);
        follows = follows.map(e => e.username);
        res.status(200).json({follows}) // contains the right result, but test says it is the wrong types
    } catch (err) {
        res.status(400).json({"status": 400, "error_msg": err});
    }
};

async function editFollow(req, res) {
    console.log("editFollow: ");
    update_latest(req)

    // not_from_sim_response = not_req_from_simulator(request)
    // if not_from_sim_response:
    //     return not_from_sim_response

    let {follow, unfollow} = req.body;
    if (!(follow || unfollow)) {
        console.error("Follow was called without neither 'follow' or 'unfollow' parameter")
        res.sendStatus(400);
    }

    try {
        if (follow) {
            await repo.follow(req.params.username, follow);
        }
        else if (unfollow) {
            await repo.unfollow(req.params.username, unfollow);
        }
        res.sendStatus(204);
    } catch (err) {
        res.status(400).json({"status": 400, "error_msg": err});
    }
};
