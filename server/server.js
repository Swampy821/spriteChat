var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    base = require('./lib/base.js'),
    cp = require('child_process'),
    port = 3000,
    stats = {};

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
        io.emit('disconnect', socket.id);
    })
});

http.listen(port, function(){
    console.log('Socket server started on port ' + port + '.');
    cp.fork(__dirname + '/hapiServer.js');
});