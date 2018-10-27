const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var http = require('http');

var db = require('./db');

const config = require('./config.json');

console.log(config);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', express.static(path.join('www/html')));

app.use('/', express.static(path.join('www/js')));

app.post('/save', function(req, res){
    db.query('');
})

server = http.createServer(app).listen(config.server_port, function(){
    console.log('Website listens to port:', config.server_port, "!");
  });

const socket = require('./sockethandler.js');
