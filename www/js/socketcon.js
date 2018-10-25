var socket = io();

socket.on('movements', function(msg){
    console.log(msg);
    
});

var json = {
    "position" : {
        "x": 200,
        "y": 100,
    },
    "name": "Fred",
    "color": "blue",
    "icon": "warrior"
}

doThisThing();

function doThisThing() {
    socket.emit('movements',  json);
    setTimeout(function(){
        doThisThing();
    }, 5000);
    
}