(function(Crafty) {
    function Game() {
        this.config = {
            players:{}
        };
    }


    Game.prototype.createWalls = function() {
        Crafty.e('Wall-right, 2D, DOM, Collision')
            .attr({"x":gameConfig.width, "y":0, "w":1, "h":gameConfig.height});
        Crafty.e('Wall-left, 2D, DOM, Collision')
            .attr({"x":0, "y":0, "w":1, "h":gameConfig.height});
        Crafty.e('Wall-top, 2D, DOM, Collision')
            .attr({"x":0, "y":0, "w":gameConfig.width, "h":1});
        Crafty.e('Wall-bottom, 2D, DOM, Collision')
            .attr({"x":0, "y":gameConfig.height, "w":gameConfig.width, "h":1});
    };


    Game.prototype.createCharacterWalls = function(char) {
        char.onHit('Wall-right', function() {
            this.x -=gameConfig.speed;
        });
        char.onHit('Wall-left', function() {
            this.x +=gameConfig.speed;
        });
        char.onHit('Wall-top', function() {
            this.y +=gameConfig.speed;
        });
        char.onHit('Wall-bottom', function() {
            this.y -=gameConfig.speed;
        });
        return char;
    };


    Game.prototype.watchForCharacters = function() {
        var self = this;
    };

    Game.prototype.createCharacter = function(id) {
        var char = Crafty.e('2D, DOM, down, Collision');
        char = this.createCharacterWalls(char);

        this.config.players[id] = char;
    };



    Game.prototype.say = function(id, str) {
        var chr = window.game.config.players[id];
        var loc = {'y': chr.attr('y'), 'x': chr.attr('x')};
        var s = Crafty.e('2D, DOM, Color, Text')
            .attr({x: loc.x, y: loc.y-40, w: 200, h: 50})
            .color('#FFFFFF')
            .text(str)
            .textFont({
                size:'18px',
                weight:'bold'
            });


        setTimeout(function() {
            s.destroy();
        }, window.gameConfig.textDelay);
    };


    Game.prototype.listenForSay = function() {
        var self = this;
        socket.on('recChat', function(res) {
           if(res.id !== window.game.config.myId) {
               self.say(res.id, res.say);
           }
        });
    }


    Game.prototype.emitSay = function(id, str) {
        socket.emit('chat', {id:id, say:str});
    };



    window.game = new Game();


    Crafty.init(gameConfig.width, gameConfig.height);
    Crafty.background('rgb(127,127,127)');

    $('#talkDiv').css('top',gameConfig.height + 11);
    $('#talkDiv > #talk')
        .css('width', gameConfig.width + 'px')
        .keydown(function(e) {
            if(e.keyCode === 13) {
                var str = $(this).val();
                window.game.say(window.game.config.myId, str);
                window.game.emitSay(window.game.config.myId, str);
                $(this).val('');
            }
        });


    //Create Character
    Crafty.sprite("img/george.png", {
        down:[0,0,50,50],
        up: [100,0,50,50],
        left: [50,0,50,50],
        right: [150,0,50,50]
    });

    //build borders;
    game.createWalls();

    game.listenForSay();

})(Crafty);