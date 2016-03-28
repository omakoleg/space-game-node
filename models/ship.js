'use strict';

var db = require('../lib/db');
var uuid = require('node-uuid');

/*
    solarsystem_id: ObjectId,
    palnet_id: ObjectId,

    // data`
    name: String,
    x: Number,
    y: Number,
    color: String,

    // body
    capacity: Number,
    speed: Number,
    structure: Number,
    devicesCount: Number,
    race: String,
    bodyType: String
 */

var object = {
    create: function(data, cb) {
        //
        console.log('[C] Ship: ', data);
        db.create('ships', data, (r) => {
            cb && cb(data);
        });
    }
};

module.exports = object;
