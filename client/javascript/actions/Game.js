(function() {
    function Game() {
        this.config = {
            players:{},
            sprites:{},
            nicks: {}
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

    Game.prototype.renderUserList = function() {
      var userList = $('.user-list');
        var nickList = this.config.nicks;
        var nickArray = [];
        for(keys in nickList) {
            nickArray.push('<img src="img/' + this.config.sprites[keys] + 'Snap.png"> ' + nickList[keys]);
        }
        if(nickArray.length>0) {

            userList.html(nickArray.join('<br>'));
        }else{
            userList.html('');
        }
    };


    Game.prototype.createCharacter = function(id, ava, nick) {
        var char = Crafty.e('2D, DOM, down, Collision');
        char = this.createCharacterWalls(char);

        this.config.players[id] = char;
        this.config.sprites[id] = ava;
        this.config.nicks[id] = nick;

        this.renderUserList();
    };

    Game.prototype.updateLog = function(name, str) {
        var log = $('#log').val();
        log = name + ': ' + str + '\n' + log;
        $('#log').val(log);
    };

    Game.prototype.say = function(id, str) {
        var chr = window.game.config.players[id];
        var nick = window.game.config.nicks[id];
        if(chr===undefined) { return; }
        var loc = {'y': chr.attr('y'), 'x': chr.attr('x')};
        var s = Crafty.e('2D, DOM, Color, Text')
            .attr({x: loc.x, y: loc.y-40, w: 200, h: 50})
            .color('#FFFFFF')
            .text(str)
            .textFont({
                size:'18px',
                weight:'bold'
            });
        this.updateLog(nick, str);

        setTimeout(function() {
            s.destroy();
        }, window.gameConfig.textDelay);
    };


    Game.prototype.listenForDisconnect = function() {
        var self = this;
        socket.on('disconnect', function(id) {
            if(self.config.players[id] !== undefined) {
                self.config.players[id].destroy();
            }
            delete self.config.players[id];
            delete self.config.nicks[id];
            delete self.config.sprites[id];
            self.renderUserList();
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



    Game.prototype.setupBoard = function(ava, nick) {
        var self = this;

        window.socket = io(window.location.hostname +':' +  3000, {
            query:'ava=' + ava + '&nick=' + nick,
            'connect timeout':1000,
            'autoReconnect':false
        });

        socket.on('connected', function (res) {
            self.config.myId = res.id;
            self.config.sprites[self.config.myId] = ava;
            self.config.nicks[self.config.myId] = nick;
            self.processCurrentCharacters(res.stat);
        });

        self.m = new M();
        self.m.init();

        Crafty.init(gameConfig.width, gameConfig.height, $('.room')[0]);
        Crafty.background(gameConfig.background);

        $('.room').parent().css('width',gameConfig.width + 2);

        self.loadCharacters();

        $('#talk')
            .keydown(function(e) {
                if(e.keyCode === 13) {
                    e.preventDefault();
                    var str = $(this).val();
                    self.say(self.config.myId, str);
                    self.emitSay(self.config.myId, str);
                    $(this).val('');
                }
            });

        //Create Character



        //build borders;
        self.createWalls();

        self.listenForSay();
        self.listenForDisconnect();
        self.listenForNewChar();
        self.listenForErrors();
    };

    Game.prototype.listenForErrors = function() {
        window.socket.on('error', function(res) {
            console.log(res | 'Error');
        });
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


    Game.prototype.listenForNewChar = function() {
        var self = this;
        window.socket.on('newChar', function(res) {
            self.createCharacter(res.id, res.ava, res.nick);
            self.m.figureOutMovement(res.id, {x:1, y:1}); //Force sprite to show up.
        });
    };


    Game.prototype.processCurrentCharacters = function(statsObj) {
        var con = this.config,
            nicks = con.nicks,
            sprites = con.sprites,
            players = con.players,
            statKeys = Object.keys(statsObj),
            self = this;

        for(var i=0; i< statKeys.length; i++) {
                var p = statsObj[statKeys[i]];
                if(players[statKeys[i]] === undefined) {
                    self.createCharacter(p.id, p.ava, p.nick);
                    self.m.figureOutMovement(p.id, p.location);
                }
            }
    };


    window.Game = Game;

})();