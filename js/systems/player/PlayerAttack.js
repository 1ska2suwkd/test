// js/systems/player/PlayerAttack.js
export function resetNextAttacks(ctrl) {
    ctrl.nextAttackByDir.hor = 'Attack1';
    ctrl.nextAttackByDir.up  = 'UpAttack1';
    ctrl.nextAttackByDir.down= 'DownAttack1';
}

export function toggleNextFor(ctrl, dir, keyJustPlayed) {
    if (dir === 'hor') ctrl.nextAttackByDir.hor = (keyJustPlayed === 'Attack1') ? 'Attack2' : 'Attack1';
    else if (dir === 'up') ctrl.nextAttackByDir.up = (keyJustPlayed === 'UpAttack1') ? 'UpAttack2' : 'UpAttack1';
    else ctrl.nextAttackByDir.down = (keyJustPlayed === 'DownAttack1') ? 'DownAttack2' : 'DownAttack1';
}

export function startAttack(ctrl, key, dir) {
    const p = ctrl.player;
    ctrl.isAttacking = true;

    if (dir === 'hor') {
        const { x: px } = ctrl.getPointerWorld();
        p.flipX = (px < p.x);
    }

    const attackSpeed = (ctrl.stats?.getValue?.('attackSpeed')) ?? 1.0;
    p.anims.timeScale = attackSpeed;
    p.play(key, true);

    const reachX = 55, reachY = 45;
    let offX=0, offY=0, w=60,h=110;

    if (dir === 'hor') { offX = p.flipX ? -reachX : reachX; offY = -10; w=60;h=120; }
    else if (dir === 'up'){ offX=0; offY=-reachY; w=140; h=60; }
    else { offX=0; offY=reachY; w=140; h=60; }

    ctrl.attackHitbox.body.setSize(w, h, true);
    ctrl.attackHitbox.setSize(w, h);
    ctrl.attackHitbox.body.setOffset(0,0);
    ctrl.attackHitbox.setPosition(p.x+offX, p.y+offY);

    ctrl.attackHitboxOffsetX=offX;
    ctrl.attackHitboxOffsetY=offY;
    ctrl.attackHitbox.body.setEnable(true);
    ctrl.attackHitbox.setVisible(true);

    p.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY+key, ()=>{
        ctrl.attackHitbox.body.setEnable(false);
        ctrl.attackHitbox.setVisible(false);

        toggleNextFor(ctrl, dir, key);
        if (ctrl.pointerHeld) {
            const nextDir = ctrl.getPointerDir();
            const nextKey = ctrl.nextAttackByDir[nextDir];
            startAttack(ctrl, nextKey, nextDir);
            return;
        }
        p.anims.timeScale=1.0;
        ctrl.isAttacking=false;
        const moving = p.body?.velocity?.length() > 0;
        p.play(moving ? 'walk' : 'idle', true);
    });
}
