var Hapi = require('hapi'),
    server = new Hapi.Server(),
    port = 3002;

server.connection({port: port});

server.route({
    method:'GET',
    path:'/',
    handler: function(request, reply) {
       reply.file('../build/client/index.html');
    }
});

server.route({
    method:'GET',
    path:'/{fold}/{name}',
    handler: function(request, reply) {
        reply.file('../build/client/' + request.params.fold + '/' + request.params.name);
    }
});



server.start(function() {
    console.log('Hapi HTTP server started on port ' + port + '.');
});