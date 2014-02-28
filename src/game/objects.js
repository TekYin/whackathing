game.module(
    'game.objects'
)
.require(
    'engine.sprite'
)
.body(function() {

Monster = game.Sprite.extend({
    interactive: true,
    anchor: {x: 0.5, y: 0.0},
    active: true,

    init: function(x) {
        this.id = game.scene.monsters.length + 1;

        this._super(x, 468, 'media/monster' + this.id + '.png');

        this.timer = new game.Timer();
        this.bounce(2000);

        game.scene.monsterContainer.addChild(this);
    },

    bounce: function(delay) {
        if(game.scene.ended) {
            this.active = false;
            game.scene.checkForGameOver();
            return;
        }

        this.interactive = true;

        game.scene.addTween(this.position, {y: 468 - this.height}, 1000, {
            delay: (delay || 200) + Math.random() * 2000,
            onStart: this.reset.bind(this),
            onComplete: this.bounce.bind(this),
            easing: game.Tween.Easing.Quadratic.InOut,
            loop: game.Tween.Loop.Reverse,
            loopCount: 1
        }).start();
    },

    gameOver: function() {
        this.interactive = false;
        game.scene.addTween(this.position, {y: 468 - 150}, 400, {
            onComplete: this.gameOverNext.bind(this),
            easing: game.Tween.Easing.Quadratic.InOut,
            loop: game.Tween.Loop.Reverse,
            loopCount: 1
        }).start();
    },

    gameOverNext: function() {
        var next = null;
        for (var i = 0; i < game.scene.monsters.length; i++) {
            if(game.scene.monsters[i] === this) {
                next = game.scene.monsters[i+1] ? game.scene.monsters[i+1] : game.scene.monsters[0];
            }
        }
        next.gameOver();
    },

    reset: function() {
        game.sound.playSound('spawn' + this.id);
        var image = 'media/monster' + Math.round(game.Math.random(1, 5)) + '.png';
        this.timer.reset();
        this.scale.x = Math.random() > 0.5 ? 1 : -1;
        this.setTexture(game.Texture.fromImage(image));
    },

    emit: function() {
        game.sound.playSound('hit');
        game.scene.emitter.position.x = this.position.x;
        game.scene.emitter.emit(10);
        this.bounce();
    },

    mousedown: function() {
        this.interactive = false;
        var points = Math.round((2000 - this.timer.time()) * 0.01);
        var speed = (468 - this.position.y) / 2;
        game.scene.addScore(points, this.position.x, this.position.y);
        game.scene.stopTweens(this.position);
        game.scene.addTween(this.position, {y: 468}, speed, {
            onComplete: this.emit.bind(this)
        }).start();
    }
});

});