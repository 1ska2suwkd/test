import { PlayerController } from "../Player/PlayerController.js";
import { CustomCursor } from "../systems/CustomCursor.js";
import { EnemyController } from "../Enemy/EnemyController.js";
import { DepthManager } from "../systems/DepthManager.js";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        // 커서
        this.cursor = new CustomCursor(this, 'customCursor');

        this.depth = new DepthManager(this, false);

        // 플레이어
        this.playerController = new PlayerController(this, 333, 433);
        this.enemyController = new EnemyController(this, 640, 360);
        this.enemyController.registerOverlap(this.playerController);

        this.depth.register(this.playerController.getRenderable());
        this.depth.register(this.enemyController.getRenderable());

        this.depth.tick();
    }

    update() {
        if (this.cursor) this.cursor.update();
        this.playerController.update();

        this.depth.tick();
    }
}