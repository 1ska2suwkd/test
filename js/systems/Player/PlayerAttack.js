export function resetNextAttacks(ctrl) {
    ctrl.nextAttackByDir.hor = 'Attack1';
    ctrl.nextAttackByDir.up = 'UpAttack1';
    ctrl.nextAttackByDir.down = 'DownAttack1';
}

export function toggleNextFor(ctrl, dir, keyJustPlayed) {
    if (dir === 'hor') {
        ctrl.nextAttackByDir.hor = (keyJustPlayed === 'Attack1') ? 'Attack2' : 'Attack1';
    } else if (dir === 'up') {
        ctrl.nextAttackByDir.up = (keyJustPlayed === 'UpAttack1') ? 'UpAttack2' : 'UpAttack1';
    } else {
        ctrl.nextAttackByDir.down = (keyJustPlayed === 'DownAttack1') ? 'DownAttack2' : 'DownAttack1';
    }
}

export function startAttack(ctrl, key, dir) {
    const p = ctrl.player;
    ctrl.isAttacking = true;

    // [중요] 이 스윙(애니메이션) 동안 이미 맞춘 적들 초기화 (1스윙 1히트)
    ctrl.alreadyHit = new Set();

    // 수평 공격 시 포인터 기준으로 좌우 결정
    if (dir === 'hor') {
        const { x: px } = ctrl.getPointerWorld();
        p.flipX = (px < p.x);
    }

    // 공속(애니메이션 속도) 반영
    const attackSpeed = (ctrl.stats?.getValue?.('attackSpeed')) ?? 1.0;
    p.anims.timeScale = attackSpeed;
    p.play(key, true);
    const attackSound = ctrl.scene.sounds?.attack;
    if (attackSound) {
        ctrl.scene.time.delayedCall(200, () => {
            attackSound.setRate(attackSpeed);  // 공격속도에 맞춰 사운드 재생 속도 변경
            attackSound.play();
        });
    }

    // ─────────────────────────────────────────────
    // 히트박스 설정(초기엔 비활성; startUp 이후에만 켜짐)
    ctrl.attackActive = false;
    ctrl.attackHitbox.body.setEnable(false);
    ctrl.attackHitbox.setVisible(false); // 디버그 시 true로

    const reachX = 55, reachY = 45;
    let offX = 0, offY = 0, w = 60, h = 110;

    if (dir === 'hor') {
        offX = p.flipX ? -reachX : reachX;
        offY = -10; w = 50; h = 120;
    } else if (dir === 'up') {
        offX = 0; offY = -reachY; w = 140; h = 60;
    } else {
        offX = 0; offY = reachY; w = 140; h = 60;
    }

    ctrl.attackHitbox.body.setSize(w, h, true);
    ctrl.attackHitbox.setSize(w, h);
    ctrl.attackHitbox.body.setOffset(0, 0);
    ctrl.attackHitbox.setPosition(p.x + offX, p.y + offY);

    ctrl.attackHitboxOffsetX = offX;
    ctrl.attackHitboxOffsetY = offY;
    // ※ startUp 전에 켜지지 않도록 여기서는 enable 하지 않음

    // ─────────────────────────────────────────────
    // 타이밍(프레임 윈도우): startUp → active → recovery
    // 필요 시 네 애니메이션 길이에 맞춰 수치만 조정해
    const startUp = 200;
    const active = 110;
    const recovery = 160;

    // startUp 이후 액티브 시작
    ctrl.scene.time.delayedCall(startUp / attackSpeed, () => {
        ctrl.attackActive = true;
        ctrl.attackHitbox.body.setEnable(true);

        // 액티브 종료
        ctrl.scene.time.delayedCall(active / attackSpeed, () => {
            ctrl.attackActive = false;
            ctrl.attackHitbox.body.setEnable(false);

            // recovery 시간은 히트박스/판정과만 관련(상태 종료는 애니메이션 완료에서 처리)
            ctrl.scene.time.delayedCall(recovery / attackSpeed, () => {
                // 여기서 isAttacking을 꺼버리면 animationcomplete와 중복될 수 있으니
                // 공격 종료/체인은 아래 animationcomplete에서만 처리
            });
        });
    });

    // ─────────────────────────────────────────────
    // 애니메이션이 실제로 끝났을 때 종료/체인 처리
    // 정확한 이벤트 키: 'animationcomplete-<key>'
    p.once(Phaser.Animations.Events.ANIMATION_COMPLETE + '-' + key, () => {
        // 안전장치: 혹시 켜져 있으면 정리
        ctrl.attackActive = false;
        ctrl.attackHitbox.body.setEnable(false);
        ctrl.attackHitbox.setVisible(false);

        // 다음 시퀀스 토글
        toggleNextFor(ctrl, dir, key);

        // 버튼/포인터가 계속 눌려 있으면 다음 공격 자동 시동
        if (ctrl.pointerHeld) {
            const nextDir = ctrl.getPointerDir();
            const nextKey = ctrl.nextAttackByDir[nextDir];
            // 다음 공격 시작
            startAttack(ctrl, nextKey, nextDir);
            return;
        }

        // 종료 처리
        p.anims.timeScale = 1.0;
        ctrl.isAttacking = false;
        const moving = p.body?.velocity?.length() > 0;
        p.play(moving ? 'walk' : 'idle', true);
    });
}
