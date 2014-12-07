/**
 * Created by marshs on 12/6/14.
 */
var config = require('./config.json');

module.exports.process = function(socket, io, stats) {
    for(var i=0; i<config.plugins.length; i++) {
        require('./' + config.plugins[i] + '.js').process(socket, io, stats);
    }
};