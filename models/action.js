'use strict';

var db = require('../lib/db');
var uuid = require('node-uuid');

var object = {
    create: function(data, cb) {
        //
        data.createdAt = new Date();
        data.actionId = uuid.v4();
        data.processed = false;
        //
        console.log('[C] Action: ', data);
        db.create('actions', data, (r) => {
            cb && cb(r);
        });
    }
};

module.exports = object;
