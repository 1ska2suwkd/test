import { PlayerController } from "../systems/Player/PlayerController.js";
import { CustomCursor } from "../systems/CustomCursor.js";
import { EnemyController } from "../systems/Enemy/EnemyController.js";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        // 커서
        this.cursor = new CustomCursor(this, 'customCursor');
        // 플레이어
        this.playerController = new PlayerController(this, 333, 433);
        this.enemyController = new EnemyController(this, 640, 360);
        this.enemyController.registerOverlap(this.playerController);

    }

    update() {
        if (this.cursor) this.cursor.update();
        this.playerController.update();
    }
}