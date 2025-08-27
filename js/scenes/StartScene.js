import { PlayerController } from "../systems/player/PlayerController.js";
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
    }

    update() {
        if (this.cursor) this.cursor.update();
        this.controller.update();
    }
}