var Stars_Group;
var score = 0;
var scoreText;

function collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 50;
    scoreText.setText('Score: ' + score);

    if (Stars_Group.countActive(true) === 0)
    {
        //  A new batch of Stars_Group to collect
        Stars_Group.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

    }
}

class Scene_Level1 extends Phaser.Scene
{
	constructor() 
	{
    	super({ key: "Scene_Level1" });
  	}

  	create_Cloud(cloud, speed)
	{
	    this.Clouds.add(cloud);
	    cloud.offset = cloud.x;
	    let rate = 1000/Math.max(Math.abs(speed), 0.01);
	    let move = Math.sign(speed);
	    cloud.scene.time.addEvent({ delay: rate, callback: () => { cloud.offset +=  move}, loop: true});
	}

	create_Parallax(parallax, rate)
	{
	    this.Parallax.add(parallax);
	    parallax.setOrigin(0).setScrollFactor(0);
	    parallax.rate = rate;
	}

  	preload() 
  	{
	    this.load.image('level1_props', 'assets/level1/props.png');
	    this.load.image('level1_tiles', 'assets/level1/tiles.png');
	    this.load.image('sky', 'assets/level1/background.png');
	    this.load.image('grass', 'assets/level1/grass.png');
	    this.load.image('cloud1', 'assets/level1/cloud1.png');
	    this.load.image('cloud2', 'assets/level1/cloud2.png');
	    this.load.image('cloud3', 'assets/level1/cloud3.png');
	    this.load.image('mountains1', 'assets/level1/mountains1.png');
	    this.load.image('mountains2', 'assets/level1/mountains2.png');
	    this.load.tilemapTiledJSON('level1', 'assets/level1/map.json');
  	}

  	create() 
  	{
		this.sound.stopAll();
		this.sound.play('mus_level1', { loop: true, volume: 0.8 });

	    this.Parallax = this.add.group();
	    this.Clouds = this.add.group();
	    this.add.tileSprite(0, 0, 320, 112, "sky").setOrigin(0).setScrollFactor(0);
	    this.create_Parallax(this.add.tileSprite(0, 82, 320, 32, "mountains2"), 0.125);
	    this.create_Parallax(this.add.tileSprite(0, 88, 320, 32, "mountains1"), 0.25);
	    this.create_Parallax(this.add.tileSprite(0, 112, 320, 64, 'grass'), 0.5);
	    
	    this.create_Cloud(this.add.image(120, 16, 'cloud2'), -6);
	    this.create_Cloud(this.add.image(160, 4, 'cloud1'), -3);
	    this.create_Cloud(this.add.image(280, 32, 'cloud3'), -10);
	    this.create_Cloud(this.add.image(40, 20, 'cloud2'), -6);
	    this.create_Cloud(this.add.image(-20, 20, 'cloud2'), -6);
	    this.create_Cloud(this.add.image(240, 24, 'cloud2'), -6);
	    this.create_Cloud(this.add.image(320, 28, 'cloud2'), -6);
	    this.create_Cloud(this.add.image(80, 32, 'cloud3'), -10);
	    this.create_Cloud(this.add.image(200, 40, 'cloud3'), -10);
	    this.create_Cloud(this.add.image(16, 40, 'cloud3'), -10);

	    const map = this.make.tilemap({key: "level1"});

	    const tile_grassland = map.addTilesetImage("environment", "level1_tiles");
	    const tile_props = map.addTilesetImage("props", "level1_props");

	    map.createDynamicLayer﻿("Background", tile_grassland, 0, 0);
	    map.createStaticLayer("Props", tile_props, 0, 2);

	    this.Doors = this.add.group(); 
	    map.createFromObjects('Objects', "Door", {}).forEach((object) => 
	    	{ this.Doors.add(new Door(this, object.x - 16, object.y, "door")); object.destroy(); });

	    let ai_layer = map.createStaticLayer("Enemy Trigger", map.addTilesetImage("trigger", "trigger"), 0, 0).setCollisionByExclusion(-1).setVisible(this.game.config.physics.arcade.debug);
	    let worldLayer = map.createStaticLayer("Walls", tile_grassland, 0, 0).setCollisionByExclusion(-1);

	    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, false);


	    this.Items = this.add.group();
	    this.Enemies = this.add.group();


	    map.createFromObjects('Objects', "Cherry", {}).forEach((object) => 
			{ this.Items.add(new Cherry(this, object.x, object.y)); object.destroy(); });
			
	    map.createFromObjects('Objects', "Key", {}).forEach((object) => 
	    	{ this.Items.add(new Key(this, object.x - 16, object.y + 16)); object.destroy(); });

	    map.createFromObjects('Objects', "Slime", {}).forEach((object) => 
	    	{ this.Enemies.add(new Slime(this, object.x, object.y)); object.destroy(); });

	    map.createFromObjects('Objects', "Bee", {}).forEach((object) => 
	    	{ this.Enemies.add(new Bee(this, object.x - 16, object.y)); object.destroy(); });


	//  Some Stars_Group to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
	    Stars_Group = this.physics.add.group({
	        key: 'star',
	        repeat: 11,
	        setXY: { x: 12, y: 0, stepX: 70 }
	    });

	    Stars_Group.children.iterate(function (child) {

	        //  Give each star a slightly different bounce
	        child.setBounceY(Phaser.Math.FloatBetween(0.9, 1));
	        child.HP = 3;
	    });

	    // The player and its settings
	    this.player = new Player(this, 16, 112);
	    //this.player = new Player(this, 1728, 0);
		//this.player = new Player(this, 2768, 112);

	    //  The score
	    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
	    // const graphics = this.add
	    //   .graphics()
	    //   .setAlpha(0.75)
	    //   .setDepth(20);
	    // worldLayer.renderDebug(graphics, {
	    //   tileColor: null, // Color of non-colliding tiles
	    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
	    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
	    // });

	//  Collision
	    this.physics.add.overlap(this.player, Stars_Group, collectStar, null, this);
	    this.physics.add.overlap(this.player.player_attack, this.Enemies, (object, attack) => { this.player.attack_hit(attack, object) }, null, this);
	    this.physics.add.overlap(this.player, this.Enemies, () => { this.player.player_get_hit() }, null, this);
	    this.physics.add.overlap(this.player, this.Items, (picker, item) => { item.pickup(picker) }, null, this);
	    this.physics.add.collider(this.player, worldLayer);
	    this.physics.add.collider(this.player, this.Doors, (player, door) => { door.open_door(player) });
	    this.physics.add.collider(this.Enemies, ai_layer);
	    this.physics.add.collider(this.Enemies, worldLayer);
	    this.physics.add.collider(Stars_Group, worldLayer);
	    //this.physics.world.createDebugGraphic();
		//this.cameras.main.once("camerafadeincomplete", () => { gameReady = true; });
		
		this.cameras.main.fadeIn(2000);

  	}

  	update()
  	{
		if(this.player.x >= 3180 && !this.transitioning)
		{
			this.cameras.main.once("camerafadeoutcomplete", () => { this.scene.start("Scene_Menu") });
			this.cameras.main.fadeOut(1000);
			this.transitioning = true;
		}
	    this.player.update();
	    this.cameras.main.scrollX = (this.player.x - 160).clamp(0, this.physics.world.bounds.width - 320);
	    var cam_x = this.cameras.main.scrollX;

	    this.Clouds.getChildren().forEach((cloud) => { cloud.x = wrap(cam_x*0.8 + cloud.offset, cam_x - 100, cam_x + 420) });
	    this.Enemies.getChildren().forEach((enemy) => { enemy.update(); });
	    this.Parallax.getChildren().forEach((parallax) => { parallax.tilePositionX = cam_x*parallax.rate; });
	}
}