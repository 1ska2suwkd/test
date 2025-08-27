// js/systems/player/PlayerAnimations.js
export function createAnimations(scene) {
    const anims = scene.anims;
    anims.create({ key: 'idle', frames: anims.generateFrameNumbers('warrior', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
    anims.create({ key: 'walk', frames: anims.generateFrameNumbers('warrior', { start: 6, end: 11 }), frameRate: 12, repeat: -1 });
    anims.create({ key: 'Attack1', frames: anims.generateFrameNumbers('warrior', { start: 12, end: 17 }), frameRate: 15, repeat: 0 });
    anims.create({ key: 'Attack2', frames: anims.generateFrameNumbers('warrior', { start: 18, end: 23 }), frameRate: 15, repeat: 0 });
    anims.create({ key: 'DownAttack1', frames: anims.generateFrameNumbers('warrior', { start: 24, end: 29 }), frameRate: 15, repeat: 0 });
    anims.create({ key: 'DownAttack2', frames: anims.generateFrameNumbers('warrior', { start: 30, end: 35 }), frameRate: 15, repeat: 0 });
    anims.create({ key: 'UpAttack1', frames: anims.generateFrameNumbers('warrior', { start: 36, end: 41 }), frameRate: 15, repeat: 0 });
    anims.create({ key: 'UpAttack2', frames: anims.generateFrameNumbers('warrior', { start: 42, end: 47 }), frameRate: 15, repeat: 0 });
}
