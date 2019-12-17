class Scene_Menu extends Phaser.Scene 
{
    constructor() 
    {
        super({ key: "Scene_Menu" });
        this.Control = false;
        this.state = "";
    }

    transitioning(transition_to)
    {
        this.transition_progess = 0;
        this.tweens.add({ targets: this, transition_progess: 1, ease: 'Linear', duration: 1000, 
            onUpdate: () => {this.customPipeline.setFloat1('time', this.transition_progess)},
            onComplete: () => {this.scene.start(transition_to)},
        });
        this.cameras.main.setRenderToTexture(this.customPipeline);
    }
    
    button_hide()
    {
        this.help_container.visible = 0;
        this.Control = false;
        this.rectangle.y = -100;
        for(var i = 0; i < this.Button.length; i++)
        {
            this.Button[i].x = -500;
            this.Button[i].idle();
        }
    }

    button_show()
    {
        this.help_container.visible = 1;
        this.Selected_Button = 0;
        this.Button[this.Selected_Button].focus();
        for(var i = 0; i < this.Button.length; i++)
        {
            this.Button[i].x = -500;
            this.tweens.add({ targets: this.Button[i], x: this.game.config.width * 0.5, ease: 'Power1', duration: 800, delay: 150*i,})
        }
        this.time.addEvent({ delay: 1000 + 150*this.Button.length, callback: () => { 
            this.Control = true
        }})
    }

    preload() 
    {
        this.load.image("button_focus", "assets/menu_button_focus.png");
        this.load.image("button_idle", "assets/menu_button_idle.png");
        this.load.image("menu_bg_clouds", "assets/menu/clouds.png");
        this.load.image("menu_bg_mountains", "assets/menu/mountains.png");
        this.load.image("menu_bg_grass2", "assets/menu/grass2.png");
        this.load.image("menu_bg_grass1", "assets/menu/grass1.png");
    }

    create() 
    {
        this.sound.stopAll();
        this.sound.play('mus_menu');

        this.bg_clouds = this.add.tileSprite(0, -8, this.game.config.width, 160, "menu_bg_clouds").setOrigin(0);
        this.bg_mountains = this.add.tileSprite(0, 80, this.game.config.width, 112, "menu_bg_mountains").setOrigin(0);
        this.bg_grass2 = this.add.tileSprite(0, 120, this.game.config.width, 50, "menu_bg_grass2").setOrigin(0);
        this.bg_grass1 = this.add.tileSprite(0, 144, this.game.config.width, 25, "menu_bg_grass1").setOrigin(0);
        this.rectangle = this.add.rectangle(0, -100, this.game.config.width, 22, 0xffffff).setOrigin(0, 0.65);

        this.Button = [];

        this.button_level1 = new Menu_Button(this, -500, this.game.config.height * 0.55, "PLAY", () => { 
            this.Control = false;
            this.time.addEvent({ delay: 1000, callback: () =>  { this.transitioning("Scene_Level1"); } })
        });

        this.button_level2 = new Menu_Button(this, -500, this.game.config.height * 0.7, "STAGE 2", () => { 
            this.Control = false;
            this.time.addEvent({ delay: 1000, callback: () =>  { this.transitioning("Scene_Level2"); } })
        });

        this.button_credit = new Menu_Button(this, -500, this.game.config.height * 0.85, "CREDIT", () => {
            this.state = "Credits";
            this.title.visible = 0;
            this.credit_container.visible = 1;
            this.button_hide();
        });

        this.Button.push(this.button_level1, this.button_level2, this.button_credit);

        this.title = this.add.text(this.game.config.width * 0.5, 40, "Adventure Trail", {fontFamily: 'monospace', fontSize: 32, fontStyle: 'bold', color: '#ffffff', align: 'center' }).setOrigin(0.5);

        this.Cursors = this.input.keyboard.createCursorKeys();
        this.Z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.customPipeline = this.game.renderer.getPipeline('Transition' + Phaser.Math.Between(1, 3));
        this.credit_container = this.add.container(0, 0);
        this.help_container = this.add.container(0, 0);

        // this.help_container.add(this.add.text(10, 150, [
        //     "In Menu:",
        //     "Arrow - Navigate",
        //     "Z - Select" ], { color: 'black'}).setOrigin(0, 1));

        this.help_container.add(this.add.text(315, 150, [
            "Control:",
            "Move - Arrow",
            "Select - Z",
            "Jump - Z",
            "Attack - X",
            "Slide - C",
            "Air Jump - Z+C" ], { color: 'black', fontSize: 12, align: 'right' }).setOrigin(1, 1));

        this.add.text(5, 5, '15520429', { fontSize: '16px', fill: '#f00' });

        this.credit_container.add(this.add.text(10, 50, [
            "Graphics:",
            "8-BitSpider",
            "foxlybr.itch.io",
            "rvros.itch.io",
            "@ansimuz",
            "@bakudas",
            "@untiedgames", ], { color: 'black'}));

        this.credit_container.add(this.add.text(310, 22, [
            "Stage Music: Eric Matyas",
            "www.soundimage.org", ], { color: 'black', align: 'right' }).setOrigin(1, 0));

        // this.credit_container.add(this.add.text(310, 87, [
        //     "GVHD: Đỗ Thị",
        //     "Thanh Tuyền", ], { color: 'red', align: 'center' }).setOrigin(1, 0.5));

        this.credit_container.add(this.add.text(310, 157, [
            "Press Z to back",
            "to title", ], { color: 'lime', align: 'right' }).setOrigin(1, 1));

        this.credit_container.visible = 0;
        this.button_show();
    }

    update()
    {
        getKeyState(this.Z)
        getKeyState(this.Cursors.up);
        getKeyState(this.Cursors.down);

        this.Button.forEach((button) => { button.update(); });
        if(this.rectangle.alpha <= 0.25)
            this.rectangle.setAlpha(Phaser.Math.FloatBetween(0.05, 0.25))

        this.bg_clouds.tilePositionX += 0.1;
        this.bg_mountains.tilePositionX += 0.125;
        this.bg_grass2.tilePositionX += 0.2;
        this.bg_grass1.tilePositionX += 0.25;

        switch(this.state)
        {
            case "Credits":
                if (this.Z.isPressed)
                {
                    this.state = "";
                    this.title.visible = 1;
                    this.credit_container.visible = 0;
                    this.button_show();
                }
                break;

            default:
                if(this.Control)
                {
                    let direction = this.Cursors.down.isPressed - this.Cursors.up.isPressed;
                    if(direction != 0)
                    {
                        let new_selected_button = Phaser.Math.Clamp(this.Selected_Button + direction, 0, this.Button.length - 1);
                        if(new_selected_button != this.Selected_Button)
                        {
                            this.Button[this.Selected_Button].idle();
                            this.Selected_Button = new_selected_button;
                            this.Button[this.Selected_Button].focus();
                            this.sound.play('snd_menu_switch');
                        }
                    }
                    else if (this.Z.isPressed)
                    {
                        this.sound.play('snd_menu_select');
                        let button = this.Button[this.Selected_Button];
                        this.rectangle.y = button.y;
                        this.rectangle.setAlpha(1);
                        this.tweens.add({ targets: this.rectangle, alpha: 0.2, ease: 'Linear', duration: 100, })
                        button.action();
                    }
                }
                break;
        }
    }

}