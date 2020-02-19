// This is the place to do input validation, before sending the requests to the database helpers
const userService = require('./userService');
const messageService = require('./messageService');

module.exports = () => {
    return {
        // initialize: async () => await ensureUsersTableExists(repo),
        createUser,
        getAllMessages,
        getMessagesPerUser,
        postMessageAsUser,
        follow, 
        unfollow,
        getFollows,
    }
};

async function createUser(username, password, email) {
    if (!username) {
        throw new Error("You have to enter a username");
    }
    if (!validateEmail(email)) {
        throw new Error("You have to enter a valid email address");
    }
    if (!password) {
        throw new Error("You have to enter a password");
    }

    console.log('- Creating new user -');
    // console.log('user: ' + username);
    // console.log('email: ' + username);
    // console.log('pass: ' + password);

    try {
        await userService.getUserID(username);
        await userService.addUser(username, password, email);
    } catch (err) {
        throw new Error("Error on createUser: ", err);
    }
}

async function getAllMessages(amount) {
    let messages;
    await call(async () => { messages = await messageService.getAllMessages(amount) }, "Error getting messages: ");
    return messages;
};

async function getMessagesPerUser(username, amount) {
    let res;
    await call( async () => res = await userService.getUserID(username), `Error finding user "${username}": `);

    let messages;
    try {
        messages = await messageService.getUserMessages(res.user_id, amount)    // have to call res.user_id, because the result from 'getUserID' a json object??
    } catch (err) {
        throw new Error(`Error finding messages for user "${username}": `, err);
    }

    return messages;
}

async function postMessageAsUser(username, text, date) {
    let res;
    await call(async () => res = await userService.getUserID(username), `Error finding user "${username}": `);
    await call(async () => await messageService.postMessage(res.user_id, text, date), "Error posting message: ");

    return;
}

async function follow(username, other) {
    let res;
    await call(async () => res = await userService.getUserID(username), `Error finding user "${username}": `);
    let res2;
    await call(async () => res2 = await userService.getUserID(other), `Error finding user "${other}": `);
    await call(async () => await userService.follow(res.user_id, res2.user_id),     "Error when trying to follow user: " );

    return;
}

async function unfollow(username, other) {
    let user_id;
    await call(async () => user_id = await userService.getUserID(username), `Error finding user "${username}": `);
    let other_id;
    await call(async () => other_id = await userService.getUserID(other), `Error finding user "${other}": `);
    await call(async () => await userService.unfollow(user_id, other_id), "Error when trying to unfollow user: " );
    
    return;
}


async function getFollows(username, no_followers) {   // TODO remove code duplication
    let res;
    await call(async () => res = await userService.getUserID(username), `Error finding user "${username}": `);

    let following;
    try {
        following = await userService.getFollows(res.user_id, no_followers);
        return following;
    } catch (err) {
        throw new Error(`Error finding following users for "${username}": `, err)
    }
}

function validateEmail(email) {
    if(!email) { return false; }

    email = email.trim();
    // if(!email.match(/^.+@.+$/)) {                // TODO check validity of mail as in python code!!!
    //     return false;
    // }

    return true;
}

async function call(toCall, errMsg) {
    try {
        await toCall();
    } catch (err){
        console.error(err);
        throw new Error(errMsg, err);
    }
}