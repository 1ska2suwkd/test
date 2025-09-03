export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.image('customCursor', 'assets/Image/UI/Pointers/cursor.png');
        this.load.image('enemy', 'assets/Image/Deco/scarecrow.png');
        this.load.audio('stepSound','assets/Sound/Player_Movement_SFX/42_Cling_climb_03.wav');
        this.load.audio('attackSound','assets/Sound/Battle_SFX/35_Miss_Evade_02.wav');
        this.load.audio('enemyHitSound', 'assets/Sound/Player_Movement_SFX/61_Hit_03.wav');

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