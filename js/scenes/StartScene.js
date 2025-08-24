import { PlayerController } from "../systems/PlayerController.js";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        // 플레이어
        this.controller = new PlayerController(this, 333, 433);
    }

    update() {
        this.controller.update();
    }
}