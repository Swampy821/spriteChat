var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var base = require('./lib/base.js');
var stats = {};

io.on('connection', function(socket){
    console.log(stats);
    var query = socket.handshake.query,
        charObj = {
            id: socket.id,
            ava:query.ava,
            nick:query.nick
        };
    socket.emit('connected', {id:socket.id, stat:stats});
    stats[socket.id] = {
        ava:charObj.ava,
        nick:charObj.nick
    };
    base.process(socket, io, stats);
    io.emit('newChar', charObj);
    socket.on('disconnect', function() {
        delete stats[socket.id];
        console.log('deleted ' + socket.id);
        io.emit('disconnect', socket.id);
    })
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});