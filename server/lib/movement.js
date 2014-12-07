/**
 * Created by marshs on 12/6/14.
 */
var config = require('./config.json');

function P() {
}


P.prototype.send = function(socket, io, location, ava) {
  io.emit('movement', {
      id: socket.id,
      loc:location,
      ava: ava
  });
};


P.prototype.listen = function(socket, io, stats) {
    var self = this;

    stats[socket.id].location = {"left":0, "top":0};
    var location = stats[socket.id].location;
    socket.on('movement', function(response) {
        location = response.loc;
        self.send(socket, io, location, response.ava);
    });
};


var p = new P();
module.exports.process = function(socket, io, stats) {
    p.listen(socket, io, stats);

};