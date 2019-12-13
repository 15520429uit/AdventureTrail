class Cherry extends Phaser.GameObjects.Sprite 
{
    constructor(scene, x, y) 
    {
        super(scene, x, y, 'cherry');
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.anims.play('cherry');
        this.body.allowGravity = false;
    }

    pickup(player)
    {
        player.HP.add(1);
        var dying = this.scene.add.sprite(this.x, this.y).anims.play('fx_item');
        dying.on('animationcomplete', () => { dying.destroy() });
        this.scene.sound.play('snd_food');
        this.scene.sound.play('snd_pickup');
        this.destroy();
    }
}

class Key extends Phaser.GameObjects.Sprite 
{
    constructor(scene, x, y) 
    {
        super(scene, x, y, 'key');
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.anims.play('key');
        this.body.allowGravity = false;
        this.start_y = y;
        this.float_y = -4;
        scene.tweens.add({ targets: this, float_y: 4, ease: 'Sine.easeInOut', duration: 1000, yoyo: true, repeat: -1,
            onUpdate: () => {this.y = this.start_y + this.float_y},}).seek(Phaser.Math.FloatBetween(0, 1));
        this.particles = this.scene.add.particles('flares', 'white');
        let emitter = this.particles.createEmitter({blendMode: 'SCREEN', frequency: 250});
        emitter.setSpeed({min: 2, max: 10});
        emitter.setAlpha({start: 1, end: 0, ease: 'Quartic.easeOut'});
        emitter.setAngle(-90);
        emitter.setScale({start: 0.05, end: 0});
        emitter.setLifespan({min: 500, max: 2000});
        emitter.startFollow(this);
        emitter.setEmitZone({source: new Phaser.Geom.Rectangle(-10, -5, 20, 20), type: 'random', quantity: 0.2 });
    }

    pickup(player)
    {
        player.key.push("key")
        var dying = this.scene.add.sprite(this.x, this.y).on('animationcomplete', () => { dying.destroy() }).anims.play('fx_item');
        this.particles.destroy();
        this.scene.sound.play('snd_key');
        this.scene.sound.play('snd_pickup');
        this.destroy();
    }
}