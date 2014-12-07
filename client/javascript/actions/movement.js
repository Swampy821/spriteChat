(function() {

    function M() {}

    M.prototype.clearComponents = function(char) {
        var removeArray = [
            'up',
            'down',
            'left',
            'right'
        ];
        for(var i=0; i<removeArray.length; i++) {
            char.removeComponent(removeArray[i]);
        }
    };

    M.prototype.move = function(char, dir) {
        this.clearComponents(char);
        char.addComponent(dir);
    };
    M.prototype.update = function(chr) {
        var pos = {'y': chr.attr('y'), 'x': chr.attr('x')};
        socket.emit('movement', {id:window.game.config.myId, loc: pos})
    };

    M.prototype.figureOutMovement = function(chr, newLoc) {
        var x = chr.attr('x');
        var y = chr.attr('y');
        if(y<newLoc.y) {
            this.move(chr,'down');
        }
        if(y>newLoc.y) {
            this.move(chr,'up');
        }
        if(x<newLoc.x) {
            this.move(chr,'right');
        }
        if(x>newLoc.x) {
            this.move(chr,'left');
        }
    };




    var m = new M();

    $(document).keydown(function (e) {

        var chr = window.game.config.players[window.game.config.myId];
        var pos = {'y': chr.attr('y'), 'x': chr.attr('x')};
        switch (e.which || e.keyCode) {
            case 37: // left
                e.preventDefault();
                m.move(chr, 'left');
                chr.attr({'x': pos.x -= gameConfig.speed});
                m.update(chr);
                break;
            case 38: // up
                e.preventDefault();
                m.move(chr, 'up');
                chr.attr({'y': pos.y -= gameConfig.speed});
                m.update(chr);
                break;
            case 39: // right
                e.preventDefault();
                m.move(chr, 'right');
                chr.attr({'x': pos.x += gameConfig.speed});
                m.update(chr);
                break;
            case 40: // down
                e.preventDefault();
                m.move(chr, 'down');
                chr.attr({'y': pos.y += gameConfig.speed});
                m.update(chr);
                break;
            default:
                return; // exit this handler for other keys
        }
    });


    socket.on('movement', function (response) {
        /* UPDATE THINGS */
        if(response.id !== window.game.config.myId) {
            if(window.game.config.players[response.id] === undefined) {
                window.game.createCharacter(response.id);
            }

            m.figureOutMovement(window.game.config.players[response.id], response.loc);

            window.game.config.players[response.id].attr({
                x:response.loc.x,
                y:response.loc.y
            });
        }
    });

})();
