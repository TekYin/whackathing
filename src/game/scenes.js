game.module(
    'game.scenes'
)
.require(
    'engine.scene',
    'engine.particle'
)
.body(function() {

SceneGame = game.Scene.extend({
    score: 0,
    time: 20000,
    monsters: [],

    init: function() {
        this.stage.addChild(new game.Sprite(0, 0, 'media/bg.png'));
        this.missLayer = new game.Container();
        this.missLayer.interactive = false;
        this.missLayer.hitArea = new game.HitRectangle(0,0,game.system.width, game.system.height);
        this.missLayer.mousedown = this.missLayer.touchstart = function(e) {
            game.scene.addScore(-10, e.global.x, e.global.y);
        };
        this.stage.addChild(this.missLayer);
        this.monsterContainer = new game.Container();
        this.stage.addChild(this.monsterContainer);
        this.stage.addChild(new game.Sprite(0, 468, 'media/fg.png', {interactive: true, click: function() {}}));

        this.scoreText = new game.BitmapText(this.score.toString(), {font: 'Pixel'});
        this.scoreText.position.x = 15;
        this.stage.addChild(this.scoreText);

        this.emitter = new game.Emitter();
        this.emitter.position.y = 468;
        this.emitter.container = this.stage;
        this.emitter.rate = 0;
        this.emitter.textures.push('media/particle.png');
        this.emitter.angle = -Math.PI / 2;
        this.emitter.angleVar = 0.5;
        this.emitter.positionVar.x = 40;
        this.emitter.speed = 200;
        this.emitter.life = 0.5;
        this.emitter.lifeVar = 0.3;
        this.emitter.accelSpeed = 400;
        this.emitter.accelSpeedVar = 100;
        this.emitter.endAlpha = 1;
        this.addEmitter(this.emitter);

        this.logo = new game.Sprite(game.system.width / 2, 250, 'media/logo.png', {
            anchor: {x:0.5, y:0.5},
            scale: {x:0, y:0}
        });
        this.addTween(this.logo.scale, {x:1, y:1}, 500, {delay: 100, easing: game.Tween.Easing.Back.Out}).start();
        this.addTween(this.logo.position, {y: this.logo.position.y + 20}, 2000, {
            easing: game.Tween.Easing.Quadratic.InOut,
            loop: game.Tween.Loop.Reverse
        }).start();
        this.stage.addChild(this.logo);

        var madewith = new game.Sprite(game.system.width / 2, game.system.height - 16, 'media/madewithpanda.png', {
            anchor: {x:0.5, y:1.0}
        });
        this.stage.addChild(madewith);

        var word = game.device.mobile ? 'TOUCH' : 'CLICK';
        this.startText = new game.BitmapText(word + ' TO START', {font: 'Pixel'});
        this.startText.position.x = game.system.width / 2 - this.startText.textWidth / 2;
        this.stage.addChild(this.startText);
    },

    mousedown: function() {
        if(this.monsters.length === 0) this.startGame();
    },

    startGame: function() {
        this.stage.removeChild(this.startText);
        this.stage.removeChild(this.logo);
        this.stopTweens(this.logo.position);

        this.missLayer.interactive = true;

        this.monsters.push(new Monster(72 + 40 + 200 * 0));
        this.monsters.push(new Monster(72 + 40 + 200 * 1));
        this.monsters.push(new Monster(72 + 40 + 200 * 2));
        this.monsters.push(new Monster(72 + 40 + 200 * 3));
        this.monsters.push(new Monster(72 + 40 + 200 * 4));

        this.addTimer(this.time, function() {
            game.scene.ended = true;
        });

        var ready = new game.Sprite(0, 300, 'media/ready.png', {
            anchor: {x: 1.0, y: 1.0}
        });
        this.addTween(ready.position, {x: game.system.width + ready.width}, 2500, {onComplete: function() {
            game.scene.stage.removeChild(ready);
        }}).start();
        this.stage.addChild(ready);
    },

    checkForGameOver: function() {
        for (var i = this.monsters.length - 1; i >= 0; i--) {
            if(this.monsters[i].active) return;
        }
        this.gameOver();
    },

    gameOver: function() {
        this.missLayer.interactive = false;
        this.monsters[0].gameOver();
        game.sound.musicVolume = 0.5;
        game.sound.playMusic('music');

        var text = new game.Sprite(game.system.width / 2, 250, 'media/gameover.png', {anchor: {x:0.5, y:0.5}});
        this.addTween(text.position, {y: text.position.y + 50}, 1000, {
            easing: game.Tween.Easing.Quadratic.InOut,
            loop: game.Tween.Loop.Reverse
        }).start();
        this.stage.addChild(text);

        var restartButton = new game.Sprite(game.system.width / 2, 550-3, 'media/restart.png', {
            anchor: {x:0.5, y:0.5},
            interactive: true,
            mousedown: function() {
                game.sound.stopMusic();
                game.system.setScene(SceneGame);
            }
        });
        this.stage.addChild(restartButton);

        var highScore = parseInt(game.storage.get('highScore')) || 0;

        text = new game.BitmapText('BEST '+highScore.toString(), {font: 'Pixel'});
        text.position.x = game.system.width / 2 - text.textWidth / 2;
        this.stage.addChild(text);

        if(this.score > highScore) {
            game.storage.set('highScore', this.score);
            text = new game.BitmapText('NEW HIGHSCORE!', {font: 'Pixel'});
            text.position.x = game.system.width / 2 - text.textWidth / 2;
            text.position.y = 40 + 16;
            this.stage.addChild(text);
            game.sound.playSound('highscore');
        }
    },

    addScore: function(score, x, y) {
        if(score > 0) game.sound.playSound('score');
        else game.sound.playSound('miss');

        var text = new game.BitmapText(score.toString(), {font: 'Pixel'});
        text.position.x = x - text.textWidth / 2;
        text.position.y = y - text.textHeight / 2;
        this.addTween(text.position, {y: text.position.y - 50}, 1000, {onComplete: function() {
            game.scene.stage.removeChild(text);
        }}).start();
        this.stage.addChild(text);

        this.score += score;
        if(this.score < 0) this.score = 0;
        this.scoreText.setText(this.score.toString());
    }
});

});