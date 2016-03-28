'use strict';

var db = require('../lib/db');
var uuid = require('node-uuid');

var object = {
    /*
        name: String,
        x: Number,
        y: Number,
        solarsystem_id: ObjectId
     */
    create: function(data, cb) {
        //
        console.log('[C] Planet: ', data);
        db.create('planets', data, (r) => {
            cb && cb(data);
        });
    }
};

module.exports = object;
