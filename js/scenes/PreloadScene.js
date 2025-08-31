export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.image('customCursor', 'assets/Image/UI/Pointers/cursor.png');
        this.load.image('enemy', 'assets/Image/Deco/scarecrow.png')
        this.load.audio('')

        this.load.spritesheet('warrior', 'assets/Image/Factions/Knights/Troops/Warrior/Blue/Warrior_Blue.png', {
            frameWidth: 192,
            frameHeight: 192
        });
    }

    create() {
        this.scene.start('StartScene');

        // this.scene.start('MainScene');
    }
}