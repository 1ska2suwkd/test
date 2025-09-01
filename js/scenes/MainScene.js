import { PlayerController } from "../Player/PlayerController.js";
// import { CustomCursor } from "../systems/CustomCursor.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        // 플레이어
        this.controller = new PlayerController(this, 333, 433);
    }

    update() {
        this.controller.update();
    }
}