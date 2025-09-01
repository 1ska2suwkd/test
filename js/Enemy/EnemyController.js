// EnemyController.js (관련 메소드만 교체/추가)

export class EnemyController {
    static _idSeed = 1;

    constructor(scene, x, y) {
        this.scene = scene;
        this.enemy = scene.physics.add.sprite(x, y, 'enemy').setDepth(2);

        // 크기/오프셋은 기존 값 유지
        this.enemy.body.setSize(50, 80);
        this.enemy.body.setOffset(73, 70);

        this.enemy.enemyId = EnemyController._idSeed++;

        // 반짝 중복 방지용
        this._isFlashing = false;
    }
    getRenderable() { return this.enemy; }

    /** 플레이어 히트박스와 겹치면 '히트 확인'만 처리 */
    registerOverlap(playerController) {
        this.scene.physics.add.overlap(
            playerController.attackHitbox,
            this.enemy,
            () => {
                // 액티브 프레임 + 히트박스 활성일 때만
                if (!playerController.attackActive) return;
                if (!playerController.attackHitbox.body.enable) return;

                const id = this.enemy.enemyId;

                // 같은 스윙(애니메이션) 동안은 한 번만
                if (playerController.alreadyHit?.has(id)) return;
                playerController.alreadyHit.add(id);

                this._hitConfirmFlash();
            },
            null,
            this
        );
    }

    /** 흰색 틴트로 히트 확인만 주기 */
    _hitConfirmFlash() {
        if (this._isFlashing) return; // 중복 플래시 방지
        this._isFlashing = true;

        this.enemy.setTintFill(0xffffff);

        // 짧게 반짝였다가 해제
        this.scene.time.delayedCall(120, () => {
            this.enemy.clearTint();
            this._isFlashing = false;
        });
    }
}
