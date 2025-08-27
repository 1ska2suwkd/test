// js/systems/player/PlayerController.js
import { Stats } from "../common/Stats.js";
import { createAnimations } from "./PlayerAnimations.js";
import { startAttack, resetNextAttacks, toggleNextFor } from "./PlayerAttack.js";
import { setupPlayerInput } from "./PlayerInput.js";

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
    }

    update() {
        if (this.isDead) return;

        const p = this.player, c = this.cursors, k = this.keys;
        const baseSpeed = this.stats.getValue('moveSpeed');
        const speed = this.isAttacking ? baseSpeed * 0.7 : baseSpeed;

        const left = c.left.isDown || k.left.isDown;
        const right= c.right.isDown|| k.right.isDown;
        const up   = c.up.isDown   || k.up.isDown;
        const down = c.down.isDown || k.down.isDown;

        let vx = 0, vy = 0;
        if (left) vx = -speed;
        if (right) vx = speed;
        if (up) vy = -speed;
        if (down) vy = speed;
        if (vx && vy) { const d = Math.SQRT1_2; vx *= d; vy *= d; }

        p.setVelocity(vx, vy);

        if (!this.isAttacking) {
            if (vx < 0) p.flipX = true; else if (vx > 0) p.flipX = false;
            if (vx || vy) p.play('walk', true);
            else p.play('idle', true);
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
