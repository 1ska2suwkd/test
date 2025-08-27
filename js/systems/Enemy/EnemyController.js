export class EnemyController {
    constructor(scene, x, y) {
        this.scene = scene;
        this.enemy = scene.physics.add.sprite(x, y, 'enemy');
        this.enemy.body.setSize(80, 110);
        this.enemy.body.setOffset(60, 50);
        // this.physics.add.collider(this.player, this.enemy, this.handlePlayerHit, null, this);
    }


}