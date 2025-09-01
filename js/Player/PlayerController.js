// js/systems/player/PlayerController.js
import { Stats } from "../common/Stats.js";
import { createAnimations } from "./PlayerAnimations.js";
import { startAttack, resetNextAttacks } from "./PlayerAttack.js";
import { setupPlayerInput } from "./PlayerInput.js";
import { createPlayerSounds } from "./PlayerSounds.js";

export class PlayerController {
    constructor(scene, x, y) {
        this.scene = scene;
        this.player = scene.physics.add.sprite(x, y, 'warrior');
        this.player.body.setSize(50, 70);
        this.player.body.setAllowGravity(false);
        this.player.body.setDrag(1000, 1000);
        this.player.body.setMaxVelocity(300, 300);

        // 스탯
        this.stats = new Stats(scene);

        // 입력
        setupPlayerInput(this, scene);

        // 애니메이션
        createAnimations(scene);
        this.player.play('idle');

        this.isDead = false;
        this.isAttacking = false;

        // 공격 상태
        this.pointerHeld = false;
        this.nextAttackByDir = { hor: 'Attack1', up: 'UpAttack1', down: 'DownAttack1' };

        // 공격 입력 등록
        scene.input.on('pointerdown', (pointer) => {
            if (!pointer.leftButtonDown()) return;
            this.pointerHeld = true;
            if (!this.isAttacking) {
                const dir = this.getPointerDir();
                const key = this.nextAttackByDir[dir];
                startAttack(this, key, dir);
            }
        });
        scene.input.on('pointerup', (pointer) => {
            if (pointer.leftButtonReleased()) {
                this.pointerHeld = false;
                resetNextAttacks(this);
            }
        });

        // 히트박스
        this.attackHitbox = this.scene.add.rectangle(this.player.x, this.player.y, 80, 30, 0xff0000, 0.3);
        this.scene.physics.add.existing(this.attackHitbox);
        this.attackHitbox.body.allowGravity = false;
        this.attackHitbox.body.setEnable(false);
        this.attackHitbox.setVisible(false);

        createPlayerSounds(scene);
        this.stepStridePx = 90;   // 발자국 1번마다 필요한 이동 거리(px) — 취향대로 30~60 조절
        this.stepAccumDist = 0;   // 누적 이동 거리

    }
    getRenderable() { return this.player; }

    update() {
        if (this.isDead) return;

        const p = this.player, k = this.keys;
        const baseSpeed = this.stats.getValue('moveSpeed');
        const speed = this.isAttacking ? baseSpeed * 0.7 : baseSpeed;

        const left = k.left.isDown;
        const right = k.right.isDown;
        const up = k.up.isDown;
        const down = k.down.isDown;

        let vx = 0, vy = 0;
        if (left) vx = -speed;
        if (right) vx = speed;
        if (up) vy = -speed;
        if (down) vy = speed;
        if (vx && vy) { const d = Math.SQRT1_2; vx *= d; vy *= d; }

        p.setVelocity(vx, vy);

        // 애니메이션 & 사운드
        if (!this.isAttacking) {
            if (vx < 0) p.flipX = true; else if (vx > 0) p.flipX = false;

            const isMoving = (vx !== 0 || vy !== 0);
            if (isMoving) {
                p.play('walk', true);

                // --- [핵심] 속도 기반 발소리 주기 ---
                const speedMag = Math.hypot(vx, vy); // 현재 속력(px/s)
                // dt (초) 추정: Phaser 루프의 delta(ms) 사용
                const dt = this.scene.game.loop.delta / 1000;
                // 이번 프레임 이동거리
                const frameDist = speedMag * dt;

                this.stepAccumDist += frameDist;

                // stride(예: 40px)마다 발소리 1번
                while (this.stepAccumDist >= this.stepStridePx) {
                    this.stepAccumDist -= this.stepStridePx;

                    // 짧은 샘플이면 겹쳐 재생 가능, 길면 isPlaying 확인
                    if (this.scene.sounds.walk) {
                        this.scene.sounds.walk.setRate(Phaser.Math.FloatBetween(0.6, 0.7));
                        this.scene.sounds.walk.play();
                    }

                }
            } else {
                p.play('idle', true);
                // 멈출 때 누적 리셋(다음에 움직이면 첫걸음부터 자연스러움)
                this.stepAccumDist = 0;
            }
        }

        if (this.attackHitbox.body.enable) {
            this.attackHitbox.x = this.player.x + this.attackHitboxOffsetX;
            this.attackHitbox.y = this.player.y + this.attackHitboxOffsetY;
        }
    }


    getPointerWorld() {
        const ptr = this.scene.input.activePointer;
        return { x: (ptr.worldX ?? ptr.x), y: (ptr.worldY ?? ptr.y) };
    }
    getPointerDir() {
        const { x: px, y: py } = this.getPointerWorld();
        const dx = px - this.player.x;
        const dy = py - this.player.y;
        if (Math.abs(dx) >= Math.abs(dy)) return 'hor';
        return dy < 0 ? 'up' : 'down';
    }
}
