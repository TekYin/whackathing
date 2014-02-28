game.module(
    'game.assets'
)
.require(
    'engine.audio'
)
.body(function() {

game.addAsset('media/bg.png');
game.addAsset('media/fg.png');
game.addAsset('media/font.fnt');
game.addAsset('media/font.png');
game.addAsset('media/madewithpanda.png');
game.addAsset('media/monster1.png');
game.addAsset('media/monster2.png');
game.addAsset('media/monster3.png');
game.addAsset('media/monster4.png');
game.addAsset('media/monster5.png');
game.addAsset('media/particle.png');
game.addAsset('media/restart.png');
game.addAsset('media/gameover.png');
game.addAsset('media/logo.png');
game.addAsset('media/ready.png');

game.addSound('media/sound/hit.m4a', 'hit');
game.addSound('media/sound/score.m4a', 'score');
game.addSound('media/sound/spawn1.m4a', 'spawn1');
game.addSound('media/sound/spawn2.m4a', 'spawn2');
game.addSound('media/sound/spawn3.m4a', 'spawn3');
game.addSound('media/sound/spawn4.m4a', 'spawn4');
game.addSound('media/sound/spawn5.m4a', 'spawn5');
game.addSound('media/sound/highscore.m4a', 'highscore');
game.addSound('media/sound/miss.m4a', 'miss');

game.addMusic('media/sound/music.m4a', 'music');

});