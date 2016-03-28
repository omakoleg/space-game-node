'use strict';

let express = require('express'),
    app = express();

app.use(express.static(__dirname + '/client'));
// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/client/index.html');
// });

module.exports = app;
