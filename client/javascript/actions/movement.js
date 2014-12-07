(function() {

    function M() {}

    M.prototype.clearComponents = function(char) {
        var removeArray = window.gameConfig.spriteArray;
        for(var i=0; i<removeArray.length; i++) {
            char.removeComponent(removeArray[i] + 'up')
                .removeComponent(removeArray[i] + 'down')
                .removeComponent(removeArray[i] + 'right')
                .removeComponent(removeArray[i] + 'left');
        }
    };

    M.prototype.move = function(char, dir) {
        this.clearComponents(char);
        char.addComponent(dir);
    };
    M.prototype.update = function(chr) {
        var pos = {'y': chr.attr('y'), 'x': chr.attr('x')};
        socket.emit('movement', {
            id:window.game.config.myId,
            loc: pos,
            ava:window.game.config.sprites[window.game.config.myId]
        });
    };

    M.prototype.figureOutMovement = function(id, newLoc) {
        var chr = window.game.config.players[id];
        var sprite = window.game.config.sprites[id];
        var x = chr.attr('x');
        var y = chr.attr('y');
        if(y<newLoc.y) {
            this.move(chr,sprite + 'down');
        }
        if(y>newLoc.y) {
            this.move(chr,sprite + 'up');
        }
        if(x<newLoc.x) {
            this.move(chr,sprite + 'right');
        }
        if(x>newLoc.x) {
            this.move(chr,sprite + 'left');
        }
    };


    M.prototype.init = function() {
        var self = this;
        $(document).keydown(function (e) {

            var chr = window.game.config.players[window.game.config.myId];
            var sprite = window.game.config.sprites[window.game.config.myId];
            var pos = {'y': chr.attr('y'), 'x': chr.attr('x')};
            switch (e.which || e.keyCode) {
                case 37: // left
                    e.preventDefault();
                    self.move(chr, sprite + 'left');
                    chr.attr({'x': pos.x -= gameConfig.speed});
                    self.update(chr);
                    break;
                case 38: // up
                    e.preventDefault();
                    self.move(chr, sprite + 'up');
                    chr.attr({'y': pos.y -= gameConfig.speed});
                    self.update(chr);
                    break;
                case 39: // right
                    e.preventDefault();
                    self.move(chr, sprite + 'right');
                    chr.attr({'x': pos.x += gameConfig.speed});
                    self.update(chr);
                    break;
                case 40: // down
                    e.preventDefault();
                    self.move(chr, sprite + 'down');
                    chr.attr({'y': pos.y += gameConfig.speed});
                    self.update(chr);
                    break;
                default:
                    return; // exit this handler for other keys
            }
        });


        socket.on('movement', function (response) {
            /* UPDATE THINGS */

                if(window.game.config.players[response.id] === undefined) {
                    window.game.createCharacter(response.id, response.ava);
                }
            if(response.id !== window.game.config.myId) {
                self.figureOutMovement(response.id, response.loc);

                window.game.config.players[response.id].attr({
                    x:response.loc.x,
                    y:response.loc.y
                });
            }
        });
    };

    window.M = M;

})();
