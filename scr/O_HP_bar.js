class HP extends Phaser.GameObjects.Image
{
    constructor(scene, x, y) 
    {
        super(scene, x, y, 'hp_bar');
        scene.add.existing(this);
        this.max = 5;
        this.current = 5;
        this.depth = 2;
        this.setFrame(this.current).setOrigin(0, 0).setScrollFactor(0).setDepth(2);
    }

    add(value)
    {
        this.current = (this.current + value).clamp(0, this.max)
        this.setFrame(this.current);
        if(this.current == 0)
            return true;
        else
            return false;
    }

    set(value)
    {
        this.current = (value).clamp(0, this.max)
        this.setFrame(this.current);
    }
}