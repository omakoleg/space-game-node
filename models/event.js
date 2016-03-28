'use strict';

var db = require('../lib/db');
var object = {
    create: function(event, cb) {
        event.createdAt = new Date();
        console.log('C Event: ', event);
        db.create('events', event, (r) => {
            cb && cb(e, r);
        });
    }
};

module.exports = object;
