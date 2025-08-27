export class EnemyController {
    constructor(scene, x, y) {
        this.scene = scene;
        this.enemy = scene.physics.add.sprite(x, y, 'enemy').setDepth(2);
        this.enemy.body.setSize(50, 80);
        this.enemy.body.setOffset(73, 70);
        // this.physics.add.collider(this.player, this.enemy, this.handlePlayerHit, null, this);
    }

    /** 플레이어 히트박스와 겹치면 자동으로 takeHit 실행 */
    registerOverlap(playerController) {
        this.scene.physics.add.overlap(
            playerController.attackHitbox,
            this.enemy,
            () => this.takeHit(),
            null,
            this
        );
    }

    takeHit() {
        // 흰색 번쩍 효과
        this.enemy.setTintFill(0xffffff);

        // 100ms 뒤 원래 색으로 복구
        this.scene.time.delayedCall(100, () => {
            this.enemy.clearTint();
        });
    }
}