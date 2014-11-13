var express = require('express');
// import middlewares
var helloWorld = require('./hello_world');
var app = express.createServer(helloWorld);
app.listen(8080);