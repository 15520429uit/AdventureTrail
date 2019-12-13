class Door extends Phaser.GameObjects.Sprite 
{
    constructor(scene, x, y, texture, open_animation = "door", open_key = "key") 
    {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.open_animation = open_animation;
        this.open_key = open_key;
        this.body.allowGravity = false;
        this.body.immovable = true;
    }

    open_door(player)
    {
        if(player.key.includes(this.open_key))
        {
            this.scene.sound.play('snd_door');
            this.scene.add.sprite(this.x, this.y).anims.play(this.open_animation, true);
            let particles = this.scene.add.particles('flares');
            let emitter = particles.createEmitter({frame: 'yellow', blendMode: 'SCREEN', frequency: -1, quantity: 10});
            emitter.setPosition(this.x, this.y);
            emitter.setAngle(90);
            emitter.setGravity(0, 10);
            emitter.setSpeed({min: 0, max: 2});
            emitter.setAlpha({start: 1, end: 0, });
            emitter.setScale({start: 0.1, end: 0});
            emitter.setLifespan({min: 500, max: 2500});
            emitter.setEmitZone({source: new Phaser.Geom.Rectangle(-4, -16, 8, 32), type: 'edge', quantity: 10 });
            emitter.explode();
            this.scene.time.addEvent({ delay: 2500, callback: () => { particles.destroy() }});
            this.destroy();
        }
    }
}