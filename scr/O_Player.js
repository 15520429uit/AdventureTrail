
class Player extends Phaser.Physics.Arcade.Sprite 
{
    constructor(scene, x, y) 
    {
        super(scene, x, y, 'hero');
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.HP = new HP(scene, 5, 5);
        this.flag = 0;
        this.depth = 2;
        this.state = "";
        this.death = false;
        this.key = [];

        this.jump = 0;
        this.hurt = 0;

        this.slide_cooldown = 0;
        this.attack_cooldown = 0;

        this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.Z = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.X = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.C = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.Cursors = scene.input.keyboard.createCursorKeys();
        this.setCollideWorldBounds(true);
        this.speed_walk = 85;
        this.speed_slide = 185
        this.current_slide_speed = 0;

        this.scene.time.addEvent({ delay: 50, loop: true, callback: () => {
            if(this.hurt > 0)
                this.alpha = Phaser.Math.FloatBetween(0.6, 1);
        }});
        this.player_attack = this.scene.physics.add.staticGroup();
    }

    attack_hit(attack, object)
    {
        this.scene.cameras.main.shake(50, 0.02);
        this.scene.sound.play('snd_sword_hit', { rate: Phaser.Math.FloatBetween(1, 1.25) });

        var effect = this.scene.add.sprite(attack.x, attack.y, 'fx_attack').setAngle(Math.random() * 360).setScale(0.5);
        effect.anims.play("fx_attack").on('animationcomplete', () => { effect.destroy() });
        

        var slash = this.scene.add.sprite(attack.x, attack.y, 'fx_slash', 5).setAngle(Math.random() * 360).setScale(2, 1);
        this.scene.tweens.add({ targets: slash, 
            scaleY: { value: 0, ease: 'Sine.easeOut', duration: 250}, 
            scaleX: { value: 0, ease: 'Linear', duration: 250},
            onComplete: () => { slash.destroy() } });
        attack.destroy();
        if(!object.hasOwnProperty('HP') || --object.HP < 1)
        {
            if(typeof object.death === 'function')
                object.death();
            else
                object.destroy();
        }
        else
            object.change_state("Hurt");
    }

    player_get_hit()
    {
        if(this.isVulnerable() && !this.death)
        {
            if(!this.HP.add(-1))
                this.change_state("Hurt");
            else
                this.change_state("Death");
        }
    }

    update()
    {
        if(this.hurt <= 0)
            this.alpha = 1;
        if(!this.death)
        {
            if(this.y > this.scene.physics.world.bounds.height)
                this.change_state("DeathSpike");
            /*else if(this.keySpace.isDown)
                this.change_state("Death");*/
        }
        
        getKeyState(this.Z);
        getKeyState(this.X);
        getKeyState(this.C);

        switch(this.state)
        {
            case "Attack":
                switch(this.flag)
                {
                    case -2:
                        this.setVelocityX(0);
                        this.anims.play('hero_unsealth_sword', true);
                        this.flag = -1;
                        break;

                    case -1:
                        if (!this.anims.isPlaying)
                            this.flag = 0;
                        break;

                    case 0:
                        this.combo = 0;
                        this.setVelocityX(0);
                        this.anims.play('hero_attack_1_1', true);
                        this.flag = 1;
                        break;

                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.scene.sound.play('snd_sword_slash');
                            this.anims.play('hero_attack_1_2', true);
                            this.flag = 2;
                            var attack_box = this.player_attack.create(this.x + (this.flipX ? -20 : 20), this.y, "", "", false);
                            this.scene.time.addEvent({ delay: 100, callback: () => { attack_box.destroy() }});
                        }
                        break;

                    case 2:
                        if(this.X.isPressed)
                            this.combo = 1;
                        if (!this.anims.isPlaying)
                        {
                            if(this.combo)
                                this.change_state("Attack2")
                            else
                            {
                                this.change_state("");
                                this.attack_cooldown = 1;
                                this.scene.time.addEvent({ delay: 500, callback: () => { this.attack_cooldown = 0; }});
                                this.anims.play('hero_idle2', true);
                            }
                        }
                        break;
                }
                break;

            case "Attack2":
                switch(this.flag)
                {
                    case 0:
                        this.setVelocityX(0);
                        this.anims.play('hero_attack_2_1', true);
                        this.combo = 0;
                        this.flag = 1;
                        break;

                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.scene.sound.play('snd_sword_slash');
                            this.anims.play('hero_attack_2_2', true);
                            this.flag = 2;
                            var attack_box = this.player_attack.create(this.x + (this.flipX ? -20 : 20), this.y, "", "", false);
                            this.scene.time.addEvent({ delay: 100, callback: () => { attack_box.destroy() }});
                        }
                        break;

                    case 2:
                        if(this.X.isPressed)
                            this.combo = 1;
                        if (!this.anims.isPlaying)
                        {
                            if(this.combo)
                                this.change_state("Attack3")
                            else
                            {
                                this.change_state("");
                                this.attack_cooldown = 1;
                                this.scene.time.addEvent({ delay: 500, callback: () => { this.attack_cooldown = 0; }});
                                this.anims.play('hero_idle2', true);
                            }
                        }
                        break;
                    }
                break;

            case "Attack3":
                switch(this.flag)
                {
                    case 0:
                        this.anims.play('hero_attack_3_1', true);
                        this.flag = 1;
                        this.setVelocityX((this.flipX ? -1 : 1)*50);
                        break;

                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.scene.sound.play('snd_sword_slash', { rate: 0.8 });
                            this.anims.play('hero_attack_3_2', true);
                            this.setVelocityX(0);
                            var attack_box = this.player_attack.create(this.x + (this.flipX ? -20 : 20), this.y, "", "", false);
                            this.scene.time.addEvent({ delay: 100, callback: () => { attack_box.destroy() }});
                            this.flag = 2;
                        }
                        break;

                    case 2:
                        if (!this.anims.isPlaying)
                        {
                            this.change_state("");
                            this.attack_cooldown = 1;
                            this.scene.time.addEvent({ delay: 500, callback: () => { this.attack_cooldown = 0; }});
                            this.anims.play('hero_idle2', true);
                        }
                        break;
                }
                break;

            case "AttackAir":
                this.body.velocity.y = Math.min(this.body.velocity.y, 10)
                this.body.velocity.x = 0;
                switch(this.flag)
                {
                    case 0:
                        var attack_box = this.player_attack.create(this.x + (this.flipX ? -20 : 20), this.y, "", "", false);
                        this.scene.time.addEvent({ delay: 100, callback: () => { attack_box.destroy() }});
                        this.anims.play('hero_attack_air', true);
                        this.scene.sound.play('snd_sword_slash');
                        this.flag = 1;
                        break;

                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.change_state("");
                            this.attack_cooldown = 1;
                            this.scene.time.addEvent({ delay: 500, callback: () => { this.attack_cooldown = 0; } });
                            this.anims.play('hero_idle2', true);
                        }
                        break;
                }
                break;

            case "Slide":
                switch(this.flag)
                {
                    case 0:
                        this.scene.sound.play('snd_slide', { rate: 1.5, volume: 0.8 });
                        this.anims.play('hero_slide', true);
                        this.current_slide_speed = this.flipX ? -200 : 200;
                        this.setVelocityX(this.current_slide_speed)
                        this.scene.tweens.add({ targets: this, current_slide_speed: 0, ease: 'Linear', duration: this.anims.duration});
                        this.flag = 1;
                        this.slide_cooldown = 1;
                        this.scene.time.addEvent({ delay: 1500, callback: () => { this.slide_cooldown = 0; } });
                        break;

                    case 1:
                        if (!this.anims.isPlaying)
                            this.change_state("")
                        if (this.body.velocity.x == 0)
                            this.current_slide_speed = 0;
                        else
                        {
                            this.body.velocity.x = this.current_slide_speed;
                            var fade = this.scene.add.image(this.x, this.y, 'hero', this.anims.currentFrame.frame.name).setAlpha(0.1).setTint(0xff0000);
                            fade.flipX = this.flipX;
                            this.scene.tweens.add({ targets: fade, alpha: 0, ease: 'Power1', duration: 250, onComplete: () => { fade.destroy() }});
                        }
                        break;
                }
                break;

            case "Boost":
                switch(this.flag)
                {
                    case 0:
                        this.scene.sound.play('snd_jump', { rate: 2.5, volume: 0.75 });
                        this.anims.play('hero_boost', true);
                        this.setVelocityY(-200)
                        this.flag = 1;
                        var effect = this.scene.add.sprite(this.x, this.y, 'fx_ring');
                        effect.on('animationcomplete', () => { effect.destroy() });
                        effect.anims.play("fx_ring");
                        effect.setAngle(this.body.velocity.x == 0 ? 0 : (this.flipX ? -30 : 30));
                        effect.setScale(0.5);
                        effect.setTint(0xff0000);
                        this.scene.tweens.add({ targets: effect, alpha: 0, ease: 'Power1', duration: 250, });
                        break;

                    case 1:
                        if (!this.anims.isPlaying || this.body.onFloor())
                            this.change_state("")
                        break;
                }
                break;

            case "Hurt":
                switch(this.flag)
                {
                    case 0:
                        this.flag = 1;
                        this.hurt = -1;
                        this.anims.play('hero_hurt', true);
                        this.scene.sound.play('snd_hurt', { volume: 0.6 });
                        this.setVelocityX((this.flipX ? 1 : -1)*90);
                        this.setVelocityY(-100);
                        this.setTint(0xff0000);
                        this.scene.time.addEvent({ delay: 200, callback: () => {
                            this.setTint(0xffffff); 
                            this.hurt = 1;
                            this.scene.time.addEvent({ delay: 3000, callback: () => {this.hurt = 0}})
                        }});
                        break;

                    case 1:
                        if (this.body.onFloor())
                            this.body.velocity.x *= 0.95;
                        if (!this.anims.isPlaying)
                        {
                            this.change_state("");
                            this.anims.play('hero_idle2', true);
                        }
                        break;
                }
                break;

            case "Death":
                if (this.body.onFloor())
                    this.body.velocity.x *= 0.9;
                switch(this.flag)
                {
                    case 0:
                        this.scene.sound.play('snd_dead');
                        this.anims.play('hero_defeat', true);
                        this.setVelocityX((this.flipX ? 1 : -1)*125);
                        this.setVelocityY(-100);
                        this.flag = 1;
                        this.death = true;
                        this.scene.cameras.main.flash(500, 255, 0, 0)
                        break;

                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.flag = 2;
                            this.scene.cameras.main.once("camerafadeoutcomplete", () => { this.scene.scene.restart(); });
                            this.scene.time.addEvent({  delay: 1000, callback: () => { this.scene.cameras.main.fade(1000, 0, 0, 0);} });
                        }
                        break;
                }
                break;

            case "DeathSpike":
                switch(this.flag)
                {
                    case 0:
                        this.HP.set(0);
                        this.scene.sound.play('snd_dead');
                        this.anims.play('hero_defeat', true);
                        this.setVelocityX(0);
                        this.flag = 1;
                        this.death = true;
                        this.scene.cameras.main.flash(500, 255, 0, 0)
                        break;

                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.flag = 2;
                            this.scene.cameras.main.once("camerafadeoutcomplete", () => { this.scene.scene.restart(); });
                            this.scene.time.addEvent({  delay: 1000, callback: () => { this.scene.cameras.main.fade(1000, 0, 0, 0);} });
                        }
                        break;
                }
                break;

            default:
                var direction = this.Cursors.right.isDown - this.Cursors.left.isDown;
                this.flag = 0;
                if (this.body.onFloor())
                {
                    this.jump = 1;
                    if(this.X.isPressed && !this.attack_cooldown)
                    {
                        this.setVelocityX(0);
                        this.change_state("Attack");
                        if(this.anims.getCurrentKey() != 'hero_idle2')
                            this.flag = -2;
                    }
                    else if(this.C.isPressed && !this.slide_cooldown)
                    {
                        this.change_state("Slide");
                    }
                    else if (this.Z.isPressed)
                    {
                        this.setVelocityY(-200);
                        this.anims.play('hero_up', true);
                        this.scene.sound.play('snd_jump', { rate: 2, volume: 0.6 });
                    }
                    else if (direction != 0)
                    {
                        this.setVelocityX(direction*75);
                        this.anims.play('hero_walk', true);
                        this.flipX = direction < 0;
                    }
                    else
                    {
                        this.setVelocityX(0);
                        if (this.anims.getCurrentKey() != 'hero_idle2')
                            this.anims.play('hero_idle', true);
                    }
                }
                else
                {
                    if(this.C.isPressed && this.jump)
                    {
                        this.jump--;
                        this.change_state("Boost");
                    }
                    else if(this.X.isPressed && !this.attack_cooldown)
                    {
                        this.change_state("AttackAir");
                    }
                    else if (direction != 0)
                    {
                        this.setVelocityX(direction*75);
                        this.flipX = direction < 0;
                    }
                    else
                        this.setVelocityX(0);
                    if (this.body.velocity.y > 0 && this.anims.getCurrentKey() != 'hero_fall')
                            this.anims.play('hero_fall', true);
                    else if (this.body.velocity.y < 0 && this.Z.isUp)
                            this.body.velocity.y *= 0.8;
                }
                break;
        }
        
        if (this.state == "Slide")
        {
            this.body.setSize(16, 16);
            this.body.offset.y = 16;
        }
        else
        {
            this.body.setSize(16, 24);
            this.body.offset.y = 8;
        }
    }

    isVulnerable()
    {
        if(this.death || this.hurt != 0 || this.state == "Attack3" || this.state == "Boost" || this.state == "Slide" || this.state == "Hurt")
            return false;
        return true;
    }
};