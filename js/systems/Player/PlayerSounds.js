export function createPlayerSounds(scene) {
  scene.sounds = {
      walk: scene.sound.add('stepSound'),
    attack: scene.sound.add('attackSound')
    // hit: scene.sound.add('hit'),
  };
}
