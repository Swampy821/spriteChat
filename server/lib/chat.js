








module.exports.process = function(socket, io, stats) {
    socket.on('chat', function(res) {
        io.emit('recChat', res);
    })

 };