'use strict'

/**
 * Service handling flagging messages
 */

const models = require('../persistence/models/models.js');
const Message = models.Message;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

function getAllMsg() {
    try {
        return Message.findAll();
    }
    catch (err) {
        console.log(err);
    }
};

function getAllMsgContaining(word) {
    try {
        return Message.findAll(
            {
                where: {
                    text: {
                        [Op.substring]: word
                    }
                }
            }
        );
    }
    catch (err) {
        console.log(err);
    }
};

function flagMessage(tweetId) {
    try {
        return Message.update(

            {
                flagMessage: 1
            },
            { 
                where: 
                { 
                    message_id: tweetId 
                } 
            }

        );
    }
    catch (err) {
        console.log(err);
    }
};

function flagMessagesContaining(word) {
    try {
        return Message.update(
            {
                flagMessage: 1
            },
            { 
                where: 
                { 
                    [Op.substring]: word
                } 
            }

        );
    }
    catch (err) {
        console.log(err);
    }
};

//Functions to export, comma seperated
module.exports = {

}