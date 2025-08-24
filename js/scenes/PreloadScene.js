export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {

        // this.load.image('StartBackground', 'assets/Scene/StartScene.png');
        // this.load.tilemapTiledJSON('map', 'assets/Scene/map.json');
        // this.load.image('IntroBackground', 'assets/Scene/IntroScene.png');
        // this.load.image('title', 'assets/title.png');
        // this.load.image('controls', 'assets/controls.png');
        // this.load.image('gameOver', 'assets/gameOver.png');
        // this.load.image('gameClear', 'assets/gameClear.png');
        // this.load.image('timeOver', 'assets/timeOver.png');

        this.load.image('customCursor', 'assets/UI/Pointers/cursor.png'); 

        this.load.spritesheet('warrior', 'assets/Factions/Knights/Troops/Warrior/Blue/Warrior_Blue.png', {
            frameWidth: 192,
            frameHeight: 192
        });
    }

    create() {
        this.scene.start('StartScene');

        // this.scene.start('MainScene');
    }
}