'use strict';

var io = require('socket.io')();
var db = require('./lib/db');
var actionModel = require('./models/action');
var clientModel = require('./models/client');

var cursorOptions = {
    tailable: true,
    awaitdata: true,
    numberOfRetries: Number.MAX_VALUE
};

db.connect((db) => {
    console.log('Connected to mongo server');

    let eventCollection = db.collection('events');

    io.on('connection', function (socket) {
        clientModel.create({ }, (client) => {
            console.log('Client Connected: ', client.clientId);
            // disconnect
            socket.on('disconnect', function() {
                clientModel.removeOneByClientId(client.clientId, () => {
                    console.log(`Client disconnect: ${client.clientId}`);
                });
            });
            // actions
            socket.on('action', function(actionData) {
                if(!actionData.name) { 
                    return console.log('Received action without name: ', actionData); 
                }
                actionModel.create(actionData, () => {
                    console.log('Action accepted: ', actionData);
                });
            });
            // polling
            var stream = eventCollection.find({
                createdAt: {'$gte': new Date() }
            }, cursorOptions).stream();
            stream.on('data', function(document) {
                console.log('Mongo data available: ', document);
                socket.emit('event', document);
            });
        });
    });
});

module.exports = io;






