export class PlayerController {
  constructor(scene, x, y) {
    this.scene = scene;
    this.player = scene.physics.add.sprite(x, y, 'warrior').setScale(1);

    this.player.body.setAllowGravity(false);
    this.player.body.setDrag(1000, 1000);
    this.player.body.setMaxVelocity(300, 300);

    // 입력: 방향키 + WASD
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      // 필요시 키보드 공격키도 추가 가능
      // attack1: Phaser.Input.Keyboard.KeyCodes.J,
      // attack2: Phaser.Input.Keyboard.KeyCodes.K,
    });

    this.createAnimations();
    this.player.play('idle');
    this.isDead = false;
    this.isAttacking = false;

    // 콤보 상태
    this.clickCount = 0;   // 0 -> 대기, 1 -> attack1 중
    this.comboQueued = false; // attack1 중에 두 번째 클릭 들어왔는지

    // 마우스 왼쪽 클릭: 콤보 처리
    scene.input.on('pointerdown', (pointer) => {
      if (!pointer.leftButtonDown()) return;

      if (!this.isAttacking) {
        // 첫 클릭: attack1 시작
        this.clickCount = 1;
        this.startAttack('attack1');
      } else if (this.clickCount === 1) {
        // attack1 진행 중 두 번째 클릭: attack2 큐잉
        this.comboQueued = true;
      }
      // 그 외 상황은 무시(attack2 중이거나 이미 큐잉되어 있음)
    });
  }

  createAnimations() {
    const anims = this.scene.anims;

    anims.create({
      key: 'idle',
      frames: anims.generateFrameNumbers('warrior', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'walk',
      frames: anims.generateFrameNumbers('warrior', { start: 6, end: 11 }),
      frameRate: 12,
      repeat: -1,
    });
    anims.create({
      key: 'attack1',
      frames: anims.generateFrameNumbers('warrior', { start: 12, end: 17 }),
      frameRate: 15,
      repeat: 0, // 한 번만 재생
    });
    anims.create({
      key: 'attack2',
      frames: anims.generateFrameNumbers('warrior', { start: 18, end: 23 }),
      frameRate: 15,
      repeat: 0, // 한 번만 재생
    });
  }

  // 공격 시작 로직(공통)
  startAttack(key) {
    this.isAttacking = true;
    this.player.setVelocity(0, 0); // 공격 중 이동 정지(원하면 제거)
    this.player.play(key, true);

    this.player.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + key,
      () => {
        // attack1 완료 시, 콤보가 큐잉되어 있으면 바로 attack2로 연계
        if (key === 'attack1' && this.comboQueued) {
          this.comboQueued = false;
          this.clickCount = 2; // 두 번째 단계
          this.startAttack('attack2');
          return;
        }

        // 그 외(attack2 완료 또는 콤보 없음): 초기화
        this.isAttacking = false;
        this.clickCount = 0;

        if (this.player.body.velocity.length() === 0) {
          this.player.play('idle', true);
        }
      }
    );
  }

  update() {
    if (this.isDead) return;

    // 공격 중에는 이동/애니메이션 갱신 스킵
    if (this.isAttacking) return;

    const p = this.player;
    const c = this.cursors;
    const k = this.keys;
    const speed = 300;

    const left  = c.left.isDown  || k.left.isDown;
    const right = c.right.isDown || k.right.isDown;
    const up    = c.up.isDown    || k.up.isDown;
    const down  = c.down.isDown  || k.down.isDown;

    let vx = 0, vy = 0;
    if (left)  vx = -speed;
    if (right) vx =  speed;
    if (up)    vy = -speed;
    if (down)  vy =  speed;

    // 대각선 보정
    if (vx !== 0 && vy !== 0) {
      const d = Math.SQRT1_2;
      vx *= d; vy *= d;
    }

    p.setVelocity(vx, vy);

    if (vx < 0) p.flipX = true;
    else if (vx > 0) p.flipX = false;

    if (vx !== 0 || vy !== 0) p.play('walk', true);
    else p.play('idle', true);
  }
}
