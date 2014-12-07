var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var base = require('./lib/base.js');
var stats = {};

io.on('connection', function(socket){
    socket.emit('connected', socket.id);
    stats[socket.id] = {};
    base.process(socket, io, stats);
    io.emit('newChar', socket.id);
    socket.on('disconnect', function() {
        console.log('disconnected ' + socket.id);
        io.emit('disconnect', socket.id);
    })
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});