'use strict'

/**
 * Service handling flagging messages
 */

const models = require('../persistence/models/models.js');
const Message = models.Message;

function getAllMsg() {
    try {
       //return Message...
    }
    catch (err) {
        console.log(err);
    }
};

function getAllMsgContaining(word) {
    try {
        //Return Message...
    }
    catch (err) {
        console.log(err);
    }
};

function flagMessage(tweetId) {
    try {
        //Return  Message... update(tweetID)
    }
    catch (err) {
        console.log(err);
    }
};

function flagMessagesContaining(word) {
    try {
        //Return  Message... update(word)
    }
    catch (err) {
        console.log(err);
    }
};

//Functions to export, comma seperated
module.exports = {
    
}