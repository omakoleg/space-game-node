'use strict';

var db = require('../lib/db');
var uuid = require('node-uuid');

/*
    x: Number,
    y: Number,
    radius: Number
 */

var object = {
    create: function(data, cb) {
        //
        console.log('[C] Solarsystem: ', data);
        db.create('solarsystems', data, (r) => {
            cb && cb(data);
        });
    }
};

module.exports = object;
