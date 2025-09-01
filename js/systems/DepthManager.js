export class DepthManager {
    constructor(scene, autoTick = true) {
        this.scene = scene;
        this.items = new Set();

        if(autoTick){
            scene.events.on('update', this.tick, this);
        }

        // 씬 파괴 시 정리
        scene.events.once(Phaser.Scene.Events.SHUTDOWN, () => this.destroy());
    }

    // 오브젝트를 등록하는 함수
    register(obj, offset = 0) {
        if (!obj || typeof obj.sepDepth !== 'function') return;
        obj.setOrigin?.(0.5, 1); // 발 위치 기준
        obj.depthOffset = offset;
        this.items.add(obj);

        obj.once('destroy', () => this.items.delete(obj));
    }
    
        tick() {
            this.items.forEach(obj => {
                let depth = obj.y + (obj.depthOffset || 0);
                obj.setDepth(Math.floor(depth));
            });
        }
    
        destroy() {
            this.items.clear();
            this.scene.events.off('update', this.tick, this);
        }
}