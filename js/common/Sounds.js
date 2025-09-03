export function createSounds(scene) {
  scene.sounds = {
    player: {
      walk: scene.sound.add('stepSound'),
      attack: scene.sound.add('attackSound')
    },
    enemy: {
      hit: scene.sound.add('enemyHitSound')
    }
  };
}