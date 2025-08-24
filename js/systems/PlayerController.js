// js/systems/playerController.js
import { PlayerStats } from "./PlayerStats.js";

export class PlayerController {
    constructor(scene, x, y) {
        this.scene = scene;
        this.player = scene.physics.add.sprite(x, y, 'warrior').setScale(1);

        this.player.body.setAllowGravity(false);
        this.player.body.setDrag(1000, 1000);
        this.player.body.setMaxVelocity(300, 300);

        // 스탯 인스턴스
        this.stats = new PlayerStats(scene);

        // 입력
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.createAnimations();
        this.player.play('idle');
        this.isDead = false;
        this.isAttacking = false;

        // 공격 입력 상태
        this.pointerHeld = false;
        this.nextAttackByDir = { hor: 'Attack1', up: 'UpAttack1', down: 'DownAttack1' };

        scene.input.on('pointerdown', (pointer) => {
            if (!pointer.leftButtonDown()) return;
            this.pointerHeld = true;
            if (!this.isAttacking) {
                const dir = this.getPointerDir();
                const key = this.nextAttackByDir[dir];
                this.startAttack(key, dir);
            }
        });
        scene.input.on('pointerup', (pointer) => {
            if (pointer.leftButtonReleased()) {
                this.pointerHeld = false;
                this.resetNextAttacks();
            }
        });
    }

    // ----- 기존 애니메이션 정의(생략 가능) -----
    createAnimations() {
        const anims = this.scene.anims;
        anims.create({ key: 'idle', frames: anims.generateFrameNumbers('warrior', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        anims.create({ key: 'walk', frames: anims.generateFrameNumbers('warrior', { start: 6, end: 11 }), frameRate: 12, repeat: -1 });
        anims.create({ key: 'Attack1', frames: anims.generateFrameNumbers('warrior', { start: 12, end: 17 }), frameRate: 15, repeat: 0 });
        anims.create({ key: 'Attack2', frames: anims.generateFrameNumbers('warrior', { start: 18, end: 23 }), frameRate: 15, repeat: 0 });
        anims.create({ key: 'DownAttack1', frames: anims.generateFrameNumbers('warrior', { start: 24, end: 29 }), frameRate: 15, repeat: 0 });
        anims.create({ key: 'DownAttack2', frames: anims.generateFrameNumbers('warrior', { start: 30, end: 35 }), frameRate: 15, repeat: 0 });
        anims.create({ key: 'UpAttack1', frames: anims.generateFrameNumbers('warrior', { start: 36, end: 41 }), frameRate: 15, repeat: 0 });
        anims.create({ key: 'UpAttack2', frames: anims.generateFrameNumbers('warrior', { start: 42, end: 47 }), frameRate: 15, repeat: 0 });
    }

    // ----- 방향 판단 유틸 -----
    getPointerWorld() {
        const ptr = this.scene.input.activePointer;
        return {
            x: (ptr.worldX ?? ptr.x),
            y: (ptr.worldY ?? ptr.y),
        };
    }
    getPointerDir() {
        const { x: px, y: py } = this.getPointerWorld();
        const dx = px - this.player.x;
        const dy = py - this.player.y;
        if (Math.abs(dx) >= Math.abs(dy)) return 'hor';
        return dy < 0 ? 'up' : 'down';
    }
    resetNextAttacks() {
        this.nextAttackByDir.hor = 'Attack1';
        this.nextAttackByDir.up = 'UpAttack1';
        this.nextAttackByDir.down = 'DownAttack1';
    }
    toggleNextFor(dir, keyJustPlayed) {
        if (dir === 'hor') this.nextAttackByDir.hor = (keyJustPlayed === 'Attack1') ? 'Attack2' : 'Attack1';
        else if (dir === 'up') this.nextAttackByDir.up = (keyJustPlayed === 'UpAttack1') ? 'UpAttack2' : 'UpAttack1';
        else this.nextAttackByDir.down = (keyJustPlayed === 'DownAttack1') ? 'DownAttack2' : 'DownAttack1';
    }

    /// 공격 시작
    startAttack(key, dir) {
        this.isAttacking = true;
        this.player.setVelocity(0, 0);

        if (dir === 'hor') {
            const { x: px } = this.getPointerWorld();
            this.player.flipX = (px < this.player.x);
        }

        //공격 중에만 재생 배수 적용 (예: 1.0 ~ 2.0)
        const attackSpeed =
            (this.stats?.getValue?.('attackSpeed')) ?? 1.0; // Stats 사용 안하면 1.0
        this.player.anims.timeScale = attackSpeed;

        this.player.play(key, true);

        this.player.once(
            Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + key,
            () => {
                // 다음 콤보 키 갱신
                this.toggleNextFor(dir, key);

                if (this.pointerHeld) {
                    // 눌림 유지 시: 다음 공격으로 즉시 이어감
                    const nextDir = this.getPointerDir();
                    const nextKey = this.nextAttackByDir[nextDir];
                    this.startAttack(nextKey, nextDir);
                    return;
                }

                //콤보 종료 시 반드시 원래 속도로 복구
                this.player.anims.timeScale = 1.0;

                this.isAttacking = false;
                if (this.player.body.velocity.length() === 0) {
                    this.player.play('idle', true);
                }
            }
        );
    }


    // ----- 이동 -----
    update() {
        if (this.isDead) return;
        if (this.isAttacking) return;

        const p = this.player;
        const c = this.cursors;
        const k = this.keys;
        const speed = this.stats.getValue('moveSpeed'); //이동속도도 스탯 반영

        const left = c.left.isDown || k.left.isDown;
        const right = c.right.isDown || k.right.isDown;
        const up = c.up.isDown || k.up.isDown;
        const down = c.down.isDown || k.down.isDown;

        let vx = 0, vy = 0;
        if (left) vx = -speed;
        if (right) vx = speed;
        if (up) vy = -speed;
        if (down) vy = speed;

        if (vx !== 0 && vy !== 0) { const d = Math.SQRT1_2; vx *= d; vy *= d; }

        p.setVelocity(vx, vy);
        if (vx < 0) p.flipX = true; else if (vx > 0) p.flipX = false;
        if (vx !== 0 || vy !== 0) p.play('walk', true); else p.play('idle', true);
    }
}
