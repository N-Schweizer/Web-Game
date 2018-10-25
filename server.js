const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var http = require('http');

//const config = require(process.argv[2]);

const config = require('./config.json');



console.log(config);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* var serverroutes = require('./server.routes.js');
 */
/* const configureRoutes = require('./server.routes.js');

configureRoutes(app); */

app.use('/', express.static(path.join('www/html')));

app.use('/', express.static(path.join('www/js')));

server = http.createServer(app).listen(config.server_port, function(){
    console.log('Website listens to port:', config.server_port, "!");
  });

const socket = require('./sockethandler.js');
/* 
var connectionMessage = { message: "A new user has joined the chatroom!" };
var disconnectMessage = { message: "A user has left us :(" };
//Das der Teil hier unter dem Server steht ist wichtig!!!

var io = require('socket.io')(server);
io.on('connection', function(socket){
    console.log("A user has connected!");
    socket.broadcast.emit('chat message', connectionMessage);
    socket.on('disconnect', function(){
        console.log('user disconnected'); 
        socket.broadcast.emit('chat message', disconnectMessage);
    });
    socket.on('test', function(msg){
        console.log(msg);
        io.emit('chat message', msg);
    });
});
   */