'use strict';

var app = require('./app');
var io = require('./io');
var server = require('http').Server(app);
var settings = require('./lib/settings');

console.log('Run frontend application on port: ' + settings.port);

io.attach(server);
server.listen(settings.port);
