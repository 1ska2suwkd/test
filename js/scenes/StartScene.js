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

        const map = this.make.tilemap({ key: 'map' });

        // JSON 안에 image가 이미 있으니까 preload 키 필요 없음
        const tilesetFlat = map.addTilesetImage('Tilemap_Flat');
        const tilesetTree = map.addTilesetImage('Tree');
        const tilesetWater = map.addTilesetImage('Water');
        const tilesetElev = map.addTilesetImage('Tilemap_Elevation');
        const tilesetWarn = map.addTilesetImage('warning');
        const tilesetBridge = map.addTilesetImage('Bridge_All');
        const tilesetGold = map.addTilesetImage('GoldMine_Active');

        // 레이어 만들기
        map.createLayer('Ground', [tilesetFlat, tilesetTree, tilesetWater, tilesetElev, tilesetWarn, tilesetBridge, tilesetGold], 0, 0);
        map.createLayer('Water', [tilesetWater], 0, 0);
        map.createLayer('Bridge', [tilesetBridge], 0, 0);
        map.createLayer('Deco', [tilesetGold, tilesetTree], 0, 0);

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