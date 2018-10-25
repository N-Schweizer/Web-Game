
var connectionMessage = { message: "A new user has joined the chatroom!" };
var disconnectMessage = { message: "A user has left us :(" };
//Das der Teil hier unter dem Server steht ist wichtig!!!

var user_count = 0;

var io = require('socket.io')(server);
io.on('connection', function(socket){
    console.log("A user has connected!");
    user_count ++;
    console.log(user_count, "Player are online");

    socket.broadcast.emit('chat message', connectionMessage);

    socket.on('disconnect', function(){
        console.log('user disconnected'); 
        user_count --;
    });
    socket.on('movements', function(msg){
        console.log(msg);
        socket.broadcast.emit('test', msg);
    });
});


/* 
// sending to sender-client only
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
socket.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
socket.broadcast.to(socketid).emit('message', 'for your eyes only'); */
  