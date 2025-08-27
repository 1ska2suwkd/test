import { PlayerController } from "../systems/Player/PlayerController.js";
import { CustomCursor } from "../systems/CustomCursor.js";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        //커서
        this.cursor = new CustomCursor(this, 'customCursor');
        // 플레이어
        this.controller = new PlayerController(this, 333, 433);
        this.enemy = this.physics.add.sprite(640, 360, 'enemy')
    }

    update() {
        if (this.cursor) this.cursor.update();
        this.controller.update();
    }
}