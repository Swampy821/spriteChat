(function() {
    window.socket = io(window.location.hostname +':' +  3000);

//GET USER ID
    socket.on('connected', function (res) {
        window.game.config.myId = res;
        window.game.createCharacter(window.game.config.myId);
    });
})();
