(function() {
    function Game() {
        this.config = {
            players:{},
            sprites:{}
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

    Game.prototype.createCharacter = function(id, ava) {
        var char = Crafty.e('2D, DOM, down, Collision');
        char = this.createCharacterWalls(char);

        this.config.players[id] = char;
        this.config.sprites[id] = ava;
    };

    Game.prototype.updateLog = function(name, str) {
        var log = $('#log').val();
        log = name + ': ' + str + '\n' + log;
        $('#log').val(log);
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
        this.updateLog(id, str);

        setTimeout(function() {
            s.destroy();
        }, window.gameConfig.textDelay);
    };

    Game.prototype.listenForDisconnect = function() {
        var self = this;
        socket.on('disconnect', function(id) {
            self.config.players[id].destroy();
        });
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



    Game.prototype.setupBoard = function(ava) {
        var self = this;

        window.socket = io(window.location.hostname +':' +  3000);

        socket.on('connected', function (res) {
            self.config.myId = res;
            self.createCharacter(self.config.myId, ava);
            self.config.sprites[self.config.myId] = ava;
        });

        var m = new M();
        m.init();

        Crafty.init(gameConfig.width, gameConfig.height);
        Crafty.background(gameConfig.background);

        self.loadCharacters();

        $('#talkDiv').css('top',gameConfig.height + 11);
        $('#talkDiv > #talk')
            .css('width', gameConfig.width + 'px')
            .keydown(function(e) {
                if(e.keyCode === 13) {
                    var str = $(this).val();
                    self.say(self.config.myId, str);
                    self.emitSay(self.config.myId, str);
                    $(this).val('');
                }
            });
        $('#log').css('width',gameConfig.width + 'px');


        //Create Character



        //build borders;
        self.createWalls();

        self.listenForSay();
        self.listenForDisconnect();
    };




    Game.prototype.loadCharacters = function() {
        Crafty.sprite("img/george.png", {
            georgedown:[0,0,50,50],
            georgeup: [100,0,50,50],
            georgeleft: [50,0,50,50],
            georgeright: [150,0,50,50]
        });
        Crafty.sprite('img/ponies.png', {
            ponydown:[20,20,50,50],
            ponyleft:[0,80,50,50],
            ponyright:[0,150,50,50],
            ponyup:[20,210,50,50]
        });
    };






    window.Game = Game;

})();