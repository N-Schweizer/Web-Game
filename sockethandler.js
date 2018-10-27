
var connectionMessage = { message: "A new user has joined the chatroom!" };
var disconnectMessage = { message: "A user has left us :(" };
//Das der Teil hier unter dem Server steht ist wichtig!!!

var user_count = 0;

var player = [];

var db = require('./db/index.js');

player = db.query('SELECT player FROM player')

//Perhaps we can't send the array with all the json objects and have to parse everything into a string first

var io = require('socket.io')(server);
io.on('connection', function(socket){

    console.log("A user has connected!");
    user_count ++;
    console.log(user_count, "Player are now online!");

    //New player connected, give him the data about all the other player
    socket.emit(player);

    //The player who just connected sends his object model for everyone else to see
    socket.on('creation', function(msg){
        var json = JSON.parse(msg);
        player.push(json);

        socket.broadcast.emit(msg);
    })

    //Player sends his ID plus a message for the others to display
    socket.broadcast.emit('chat message', function(msg){
        //Example
        //{"id":21,
        //"message": "mockup_message"}
        socket.broadcast.emit(msg);
    });

    //Player makes a move and sends his new movement to everyone
    socket.on('movements', function(msg){
        //Example
        //{"id": 21,
        //"positionx": 20,
        //"positiony": 30}
        console.log(msg);
        socket.broadcast.emit('movements', msg);
    });

    //Custom event a player calls before he disconnects so the other player can remove
    //his player model from their screens
    //Send only ID of playerobject
    socket.on('disconnection', function(msg){
        //var msg = JSON.parse(msg);
        for(person in player){
            if(player[person].id == msg){
                player.pop(person);
            }
        }
        socket.broadcast.emit(msg);
    })
    //Event send automatically when a user disconnects
    socket.on('disconnect', function(){
        console.log('user disconnected'); 
        user_count --;
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
  