function getKeyState(key)
{
    key.isPressed = !key.previous_down && key.isDown;
    key.isReleased = key.previous_down && !key.isDown;
    key.previous_down = key.isDown;
}

function wrap(value, min, max) 
{
    var _temp = max - min;
    if (_temp == 0)
        return value;
    while (value < min)
        value += _temp;
    while (value > max)
        value -= _temp;
    return value;
};

Number.prototype.clamp = function(min, max) 
{
    return Math.min(Math.max(this, min), max);
};

Phaser.GameObjects.Sprite.prototype.change_state = function(state, flag = 0)
{
    this.state = state;
    this.flag = flag;
};

class Scene_Boot extends Phaser.Scene 
{
    constructor() 
    {
        super({ key: "Scene_Boot" });
    }

    preload() 
    {
        this.load.image('trigger', 'assets/trigger.png');
		this.load.image('star', 'assets/star.png');
	    this.load.spritesheet('key', 'assets/key.png', { frameWidth: 9, frameHeight: 18 });
	    this.load.spritesheet('bee', 'assets/bee.png', { frameWidth: 29, frameHeight: 30 });
	    this.load.spritesheet('door', 'assets/door.png', { frameWidth: 12, frameHeight: 36 });
	    this.load.spritesheet('slime', 'assets/slime.png', { frameWidth: 32, frameHeight: 25 });
	    this.load.spritesheet('cherry', 'assets/cherry.png', { frameWidth: 19, frameHeight: 16 });
	    this.load.spritesheet('hero', 'assets/adventurer.png', { frameWidth: 50, frameHeight: 37 });
	    this.load.spritesheet('fx_item', 'assets/fx_item.png', { frameWidth: 32, frameHeight: 32 });
	    this.load.spritesheet('fx_ring', 'assets/fx_ring.png', { frameWidth: 192, frameHeight: 192 });
	    this.load.spritesheet('fx_slash', 'assets/fx_slash.png', { frameWidth: 96, frameHeight: 96 });
		this.load.spritesheet('fx_attack', 'assets/fx_attack.png', { frameWidth: 192, frameHeight: 192 });
	    this.load.spritesheet('enemy_death', 'assets/enemy_death.png', { frameWidth: 37, frameHeight: 39 });
	    this.load.spritesheet('hero', 'assets/adventurer.png', { frameWidth: 50, frameHeight: 37 });
	    this.load.spritesheet('hp_bar', 'assets/hp_bar.png', { frameWidth: 71, frameHeight: 16 });
		
	    this.load.atlas('flares', 'assets/fx_flares.png', 'assets/fx_flares.json');

		this.load.audio('snd_jump', 'assets/audio/jump.mp3');
		this.load.audio('snd_hurt', 'assets/audio/hurt.mp3');
		this.load.audio('snd_dead', 'assets/audio/dead.mp3');
		this.load.audio('snd_slide', 'assets/audio/slide.mp3');
		this.load.audio('snd_key', 'assets/audio/key.mp3');
		this.load.audio('snd_food', 'assets/audio/food.mp3');
		this.load.audio('snd_door', 'assets/audio/door.mp3');
		this.load.audio('snd_pickup', 'assets/audio/itemize.mp3');
		this.load.audio('snd_sword_slash', 'assets/audio/sword_woosh.mp3');
		this.load.audio('snd_sword_hit', 'assets/audio/sword_hit.mp3');
		this.load.audio('snd_slime_splat', 'assets/audio/slime_splat.mp3');
		this.load.audio('snd_slime_death', 'assets/audio/slime_death.mp3');
		this.load.audio('snd_insect_death', 'assets/audio/insect_death.mp3');
		this.load.audio('snd_menu_switch', 'assets/audio/menu_switch.mp3');
		this.load.audio('snd_menu_select', 'assets/audio/menu_select.mp3');
		this.load.audio('mus_menu', 'assets/audio/Title.mp3');
		this.load.audio('mus_level1', 'assets/audio/Forest Drama.mp3');
		this.load.audio('mus_level2', 'assets/audio/Wicked Dreams.mp3');


        /*
        Loader Events:
            complete - when done loading everything
            progress - loader number progress in decimal
        */

        this.load.on("progress", (percent) => { this.add.graphics({ fillStyle: { color: 0xffffff }}).fillRect(0, this.game.renderer.height / 2 - 20, this.game.renderer.width * percent, 40); })
        this.load.on("complete", () => { this.scene.start("Scene_Menu"); });
    }

    create() 
    {
	    //player animation
	    this.anims.create({ key: 'hero_walk', frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 13 }), repeat: -1, frameRate: 10, });
	    this.anims.create({ key: 'hero_idle', frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }), repeat: -1, frameRate: 7, });
	    this.anims.create({ key: 'hero_idle2', frames: this.anims.generateFrameNumbers('hero', { start: 38, end: 41 }), repeat: -1, frameRate: 7, });
	    this.anims.create({ key: 'hero_boost', frames: this.anims.generateFrameNumbers('hero', { start: 17, end: 21 }), frameRate: 20, repeat: 1});
	    this.anims.create({ key: 'hero_up', frames: this.anims.generateFrameNumbers('hero', { start: 77, end: 78 }), repeat: -1, frameRate: 8, });
	    this.anims.create({ key: 'hero_fall', frames: this.anims.generateFrameNumbers('hero', { start: 22, end: 23 }), repeat: -1, frameRate: 8, });
	    this.anims.create({ key: 'hero_unsealth_sword', frames: this.anims.generateFrameNumbers('hero', { start: 69, end: 73 }), frameRate: 20, });
	    this.anims.create({ key: 'hero_attack_1_1', frames: this.anims.generateFrameNumbers('hero', { start: 42, end: 43 }), frameRate: 15, });
	    this.anims.create({ key: 'hero_attack_1_2', frames: this.anims.generateFrameNumbers('hero', { start: 44, end: 47 }), frameRate: 15, });
	    this.anims.create({ key: 'hero_attack_2_1', frames: this.anims.generateFrameNumbers('hero', { start: 47, end: 49 }), frameRate: 15, });
	    this.anims.create({ key: 'hero_attack_2_2', frames: this.anims.generateFrameNumbers('hero', { start: 50, end: 52 }), frameRate: 15, });
	    this.anims.create({ key: 'hero_attack_3_1', frames: this.anims.generateFrameNumbers('hero', { start: 53, end: 54 }), frameRate: 10, });
	    this.anims.create({ key: 'hero_attack_3_2', frames: this.anims.generateFrameNumbers('hero', { start: 55, end: 58 }), frameRate: 15, });
	    this.anims.create({ key: 'hero_attack_air', frames: this.anims.generateFrameNumbers('hero', { start: 96, end: 99 }), frameRate: 12, });
	    this.anims.create({ key: 'hero_slide', frames: this.anims.generateFrameNumbers('hero', { start: 24, end: 28 }), duration: 800, });
	    this.anims.create({ key: 'hero_hurt', frames: this.anims.generateFrameNumbers('hero', { start: 59, end: 61 }), frameRate: 5, });
	    this.anims.create({ key: 'hero_defeat', frames: this.anims.generateFrameNumbers('hero', { start: 62, end: 68 }), frameRate: 8, });
	    
	    //effect animation
	    this.anims.create({ key: 'fx_item', frames: this.anims.generateFrameNumbers('fx_item', { start: 0, end: 3 }), frameRate: 10 });
	    this.anims.create({ key: 'fx_ring', frames: this.anims.generateFrameNumbers('fx_ring', { start: 0, end: 19 }), duration: 250, });
	    this.anims.create({ key: 'fx_attack', frames: this.anims.generateFrameNumbers('fx_attack', { start: 0, end: 3 }), duration: 125, });

	//Slime animations
	    this.anims.create({ key: 'slime_idle', frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
	    this.anims.create({ key: 'slime_move', frames: this.anims.generateFrameNumbers('slime', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
	    this.anims.create({ key: 'slime_attack', frames: this.anims.generateFrameNumbers('slime', { start: 8, end: 12 }), frameRate: 10, });
	    this.anims.create({ key: 'slime_hurt', frames: this.anims.generateFrameNumbers('slime', { start: 13, end: 16 }), duration: 600, });
		this.anims.create({ key: 'slime_death', frames: this.anims.generateFrameNumbers('slime', { start: 17, end: 20 }), frameRate: 8, });
		
	    this.anims.create({ key: 'enemy_death', frames: this.anims.generateFrameNumbers('enemy_death', { start: 0, end: 5 }), frameRate: 10 });

    //Piranha Plant
    	this.anims.create({ key: 'piranha_plant_idle', frames: this.anims.generateFrameNumbers('piranha_plant', { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
	    this.anims.create({ key: 'piranha_plant_attack', frames: this.anims.generateFrameNumbers('piranha_plant', { start: 5, end: 8 }), frameRate: 10, });

	//
	    this.anims.create({ key: 'cherry', frames: this.anims.generateFrameNumbers('cherry', { start: 0, end: 4 }), frameRate: 10, yoyo: true, repeat: -1 });
		this.anims.create({ key: 'key', frames: this.anims.generateFrameNumbers('key', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
	    this.anims.create({ key: 'bee', frames: this.anims.generateFrameNumbers('bee', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
		this.anims.create({ key: 'door', frames: this.anims.generateFrameNumbers('door', { start: 0, end: 4 }), frameRate: 10 });
		
		let shd_transition1 = new Phaser.Class
        ({ 
            Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline, initialize:
            function shd_transition(game)
            {
                Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, { game: game, renderer: game.renderer,
                    fragShader: [
                        "precision mediump float;",

                        "const float smooth_area = 0.1;",
                        "const bool decrease = false;",
                        "const bool left_to_right = true;",
                        "uniform float     time;",
                        "uniform sampler2D uMainSampler;",
                        "varying vec2 outTexCoord;",

                        "void main( void ) {",
                            "float t = time;",
                            "t = clamp(t, 0.0, 1.0);",
                            "t = left_to_right ? 1.-t : t;",
                            "t = (1.0 + smooth_area*2.) * t - smooth_area;",
                            "float a = smoothstep(t-smooth_area, t+smooth_area, outTexCoord.x);",
                            "a = decrease ? a: 1.-a;",
                            "gl_FragColor = texture2D(uMainSampler, outTexCoord) * a;",
                        "}"
                    ].join('\n')
                });
            }
        });

        let shd_transition2 = new Phaser.Class
        ({ 
            Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline, initialize:
            function shd_transition(game)
            {
                Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, { game: game, renderer: game.renderer,
                    fragShader: [
                        "precision mediump float;",

                        "const float count = 10.;",
                        "const float smoothness = 0.5;",

                        "uniform float     time;",
                        "uniform sampler2D uMainSampler;",
                        "varying vec2 outTexCoord;",

                        "void main( void ) {",
                            "float t = time;",
                            "float pr = smoothstep(-smoothness, 0.0, outTexCoord.x - time * (1.0 + smoothness));",
                            "float s = step(pr, fract(count * outTexCoord.x));",
                            "gl_FragColor = mix(texture2D(uMainSampler, outTexCoord), vec4(0.0), s);",
                        "}"
                    ].join('\n')
                });
            }
        });

        let shd_transition3 = new Phaser.Class
        ({ 
            Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline, initialize:
            function shd_transition3(game)
            {
                Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, { game: game, renderer: game.renderer,
                    fragShader: [
                        "precision mediump float;",

                        "const float divisions = 5.;",
                        "uniform float     time;",
                        "uniform sampler2D uMainSampler;",
                        "varying vec2 outTexCoord;",

                        "void main( void ) {",
                            "float t = fract(min(time, 0.9999))*3.-1.;",
                            "vec2 f_st = fract(outTexCoord*divisions);",
                            "vec2 i_st = floor(outTexCoord*divisions);",
                            "f_st -= 0.5;",
                            "t = (1.-t+(i_st.x/divisions) - (1.-i_st.y/divisions));",
                            "float a = (step(t, 1.-abs(f_st.x+f_st.y))*step(t, 1.-abs((f_st.x)-(f_st.y))));",
                            "gl_FragColor = texture2D(uMainSampler, outTexCoord) * (1.-a);",
                        "}"
                    ].join('\n')
                });
            }
        });

        this.game.renderer.addPipeline('Transition1', new shd_transition1(this.game));
        this.game.renderer.addPipeline('Transition2', new shd_transition2(this.game));
        this.game.renderer.addPipeline('Transition3', new shd_transition3(this.game));
    }
}