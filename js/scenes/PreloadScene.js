export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.image('customCursor', 'assets/UI/Pointers/cursor.png');
        this.load.image('enemy', 'assets/Deco/scarecrow.png')

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