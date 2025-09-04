import { createSounds } from "../common/Sounds.js";
import { PlayerController } from "../Player/PlayerController.js";
import { CustomCursor } from "../systems/CustomCursor.js";
import { EnemyController } from "../Enemy/EnemyController.js";
import { DepthManager } from "../systems/DepthManager.js";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        // Tilemap 생성
        const map = this.make.tilemap({ key: 'map' });
        const tilesets = [
            map.addTilesetImage('Tilemap_Flat', 'Tilemap_Flat'),
            map.addTilesetImage('Tree', 'Tree'),
            map.addTilesetImage('Water', 'Water'),
            map.addTilesetImage('Tilemap_Elevation', 'Tilemap_Elevation'),
            map.addTilesetImage('GoldMine_Active', 'GoldMine_Active'),
            map.addTilesetImage('warning', 'warning'),
            map.addTilesetImage('Bridge_All', 'Bridge_All')
        ];

        map.createLayer('Water', tilesets, 0, 0);
        map.createLayer('Ground', tilesets, 0, 0);
        map.createLayer('Bridge', tilesets, 0, 0);
        map.createLayer('DungeonEntrance', tilesets, 0, 0);
        map.createLayer('Deco', tilesets, 0, 0);

        // 커서
        this.cursor = new CustomCursor(this, 'customCursor');

        this.depth = new DepthManager(this, false);

        createSounds(this);

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