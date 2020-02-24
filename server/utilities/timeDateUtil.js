'use strict'

/**
 * Class for handling date related logic.
 */

function getFormattedDate() {
    let d = new Date();
    return d.toLocaleTimeString() + ', ' + d.toLocaleDateString();
}


module.exports = {
    getFormattedDate,
}