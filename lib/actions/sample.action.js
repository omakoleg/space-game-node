'use strict';

let event = require('../../models/event');

var object = {
    run: function(action, db) {
        console.log('Process sample action: ', action);
        event.create({
            pong: action
        }); // do not wait for results
    }
};

module.exports = object;
