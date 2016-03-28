'use strict';

var db = require('../lib/db');
var uuid = require('node-uuid');

var object = {
    create: function(data, cb) {
        //
        data.clientId = uuid.v4().substring(0, 13);
        //
        console.log('[C] Client: ', data);
        db.create('clients', data, (r) => {
            cb && cb(data);
        });
    },
    removeOneByClientId: function(clientId, cb) {
        db.removeOne('clients', { clientId: clientId }, cb);
    }
};

module.exports = object;
