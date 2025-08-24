export class PlayerController {
    constructor(scene, x, y) {
        this.scene = scene;
        this.player = scene.physics.add.sprite(x, y, 'warrior').setScale(1);

        this.player.body.setAllowGravity(false);
        this.player.body.setDrag(1000, 1000);     // 관성 줄이기(옵션)
        this.player.body.setMaxVelocity(300, 300); // 안전한 최대속(옵션)

        // 방향키 + WASD 입력 등록
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.createAnimations();
        this.player.play('idle');
        this.isDead = false;
    }

    createAnimations() {
        const anims = this.scene.anims;

        anims.create({
            key: 'idle',
            frames: anims.generateFrameNumbers('warrior', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'walk',
            frames: anims.generateFrameNumbers('warrior', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        // anims.create({
        //     key: 'end',
        //     frames: anims.generateFrameNumbers('player', { start: 7, end: 7 }),
        //     frameRate: 100,
        //     repeat: -1
        // });
    }

    update() {
        if (this.isDead) return;

        const p = this.player;
        const c = this.cursors;
        const k = this.keys;
        const speed = 300;

        // 입력 상태
        const left = c.left.isDown || k.left.isDown;
        const right = c.right.isDown || k.right.isDown;
        const up = c.up.isDown || k.up.isDown;
        const down = c.down.isDown || k.down.isDown;

        // 기본 속도(대각선 보정 전)
        let vx = 0, vy = 0;
        if (left) vx = -speed;
        if (right) vx = speed;
        if (up) vy = -speed;
        if (down) vy = speed;

        // 대각선이면 1/√2 보정
        if (vx !== 0 && vy !== 0) {
            const d = Math.SQRT1_2; // 1 / Math.sqrt(2)
            vx *= d;
            vy *= d;
        }

        // 이동 적용
        p.setVelocity(vx, vy);

        // 방향에 따른 좌우 반전(도트/횡스크롤 느낌 유지용)
        if (vx < 0) p.flipX = true;
        else if (vx > 0) p.flipX = false;

        // 애니메이션 전환
        if (vx !== 0 || vy !== 0) p.play('walk', true);
        else p.play('idle', true);
    }
}
