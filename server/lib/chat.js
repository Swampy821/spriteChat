








module.exports.process = function(socket, io, stats) {
    /* * * * * * * * * *
     *  DO THINGS HERE *
     * * * * * * * * * */
    socket.on('chat', function(res) {
        io.emit('recChat', res);
    })

 };