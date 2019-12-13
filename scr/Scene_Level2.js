class Scene_Level2 extends Phaser.Scene
{
	constructor() 
	{
    	super({ key: "Scene_Level2" });
	}
	  
  	preload() 
  	{
		this.load.spritesheet('level2_lava', 'assets/level2/lava.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('level2_water', 'assets/level2/water.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('level2_waterfall', 'assets/level2/waterfall.png', { frameWidth: 16, frameHeight: 16 });

	    this.load.image('level2_props', 'assets/level2/props.png');
	    this.load.image('level2_tiles', 'assets/level2/tiles.png');
	    this.load.tilemapTiledJSON('level2', 'assets/level2/map.json');
  	}

  	create() 
  	{
		this.sound.stopAll();
		this.sound.play('mus_level2', { loop: true, volume: 0.8 });

		this.anims.create({ key: 'level2_lava', frames: this.anims.generateFrameNumbers('level2_lava', { start: 0, end: 2 }), repeat: -1, frameRate: 8 });
		this.anims.create({ key: 'level2_water', frames: this.anims.generateFrameNumbers('level2_water', { start: 0, end: 2 }), repeat: -1, frameRate: 8 });
		this.anims.create({ key: 'level2_waterfall', frames: this.anims.generateFrameNumbers('level2_waterfall', { start: 0, end: 2 }), repeat: -1, frameRate: 8 });

	    const map = this.make.tilemap({key: "level2"});

	    const tile_props = map.addTilesetImage("props", "level2_props");
	    const tile_environment = map.addTilesetImage("environment", "level2_tiles");

		map.createStaticLayer("Background", tile_props, 0, 0);
		
		for(let i = 8; i <= 136; i += 16)
			this.add.sprite(176, i, 'level2_waterfall').anims.play('level2_waterfall');

		let walls_layer = map.createDynamicLayer﻿("Walls", tile_environment, 0, 0).setCollisionByExclusion(-1);
		let spike_layer = map.createStaticLayer("Spike", tile_environment, 0, 0).setCollisionBetween(119, 121);
	    let ai_layer = map.createStaticLayer("Enemy Trigger", map.addTilesetImage("trigger", "trigger"), 0, 0).setCollisionByExclusion(-1).setVisible(this.game.config.physics.arcade.debug);
		
		map.createStaticLayer("Props", tile_environment, 0, 0);

	    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, false);


	    this.Items = this.add.group();
	    this.Enemies = this.add.group();

	    map.createFromObjects('Objects', "Cherry", {}).forEach((object) => 
	    	{ this.Items.add(new Cherry(this, object.x, object.y)); object.destroy(); });

	    map.createFromObjects('Objects', "Slime", {}).forEach((object) => 
	    	{
				let slime = new Slime(this, object.x, object.y);
				slime.body.offset.y = 13;
				this.Enemies.add(slime); 
				object.destroy(); 
			});

		this.player = new Player(this, 16, 80);
		//this.player = new Player(this, 1616, 48);
		//this.player = new Player(this, 3456, 64);

		this.add.sprite(160, 144, 'level2_water').anims.play('level2_water');
		this.add.sprite(192, 144, 'level2_water').anims.play('level2_water');
		for(let i = 1488; i <= 1776; i += 32)
			this.add.sprite(i, 144, 'level2_lava').anims.play('level2_lava');

		const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
		
	    // worldLayer.renderDebug(graphics, {
	    //   tileColor: null, // Color of non-colliding tiles
	    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
	    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
	    // });

	//  Collision
		//spike_layer.setTileIndexCallback([119, 120, 121], () => {this.player.player_get_hit()}, this);
		this.physics.add.overlap(this.player.player_attack, this.Enemies, (object, attack) => { this.player.attack_hit(attack, object) }, null, this);
	    this.physics.add.overlap(this.player, this.Items, (picker, item) => { item.pickup(picker) }, null, this);
		this.physics.add.overlap(this.player, this.Enemies, () => { this.player.player_get_hit() }, null, this);
		this.physics.add.collider(this.player, spike_layer, () => { this.player.player_get_hit() }, null, this);
		this.physics.add.collider(this.player, walls_layer);
	    this.physics.add.collider(this.Enemies, walls_layer);
	    this.physics.add.collider(this.Enemies, ai_layer);
	    //this.physics.world.createDebugGraphic();

	    this.lighting = this.textures.createCanvas('lights', map.widthInPixels, map.heightInPixels);
	    if(!this.lighting)
	    	this.lighting = this.textures.get('lights');
	    this.darkness = this.add.image(0, 0, "lights").setOrigin(0).setDepth(1);
        this.cameras.main.fadeIn(2000);
  	}

  	update()
  	{
		this.player.update();
		if (this.player.state == "Slide")
        {
            this.player.body.setSize(16, 16);
            this.player.body.offset.y = 20;
        }
        else
        {
            this.player.body.setSize(16, 24);
            this.player.body.offset.y = 12;
        }
		this.cameras.main.scrollX = (this.player.x - 160).clamp(0, this.physics.world.bounds.width - 320);

		if (this.player.x > 3976 && !this.transitioning)
		{
			this.cameras.main.once("camerafadeoutcomplete", () => { this.scene.start("Scene_Menu") });
			this.cameras.main.fadeOut(1000);
			this.transitioning = true;
		}

		this.lighting.context.globalCompositeOperation = 'copy';
	    this.lighting.context.fillStyle = '#000000fb';
    	this.lighting.context.fillRect(0, 0, this.lighting.width, this.lighting.height);
    	this.lighting.context.globalCompositeOperation = 'destination-out';
		this.lighting.context.fillStyle = '#ffffff88';
		if(this.player.state != "DeathSpike")
		{
			let tau = 2*Math.PI
			this.lighting.context.beginPath();
			this.lighting.context.arc(this.player.x, this.player.y, 60, 0, tau);
			this.lighting.context.fill();
			this.lighting.context.arc(this.player.x, this.player.y, 75 + Phaser.Math.FloatBetween(-0.5, 0.5), 0, tau);
			this.lighting.context.fill();
			this.lighting.context.arc(this.player.x, this.player.y, 80, 0, tau);
			this.lighting.context.fill();
		}
		this.lighting.context.fillStyle = '#ffffff11';
		for (let i = 0; i < 15; i++)
		{
			let rand = Phaser.Math.FloatBetween(-1, 1);
			this.lighting.context.fillRect(1472 - i*4 + rand, 0, 336 + 8*i - 2*rand, 160);
		}
    	this.lighting.refresh();

	    this.Enemies.getChildren().forEach((enemy) => { enemy.update(); });
	}
}