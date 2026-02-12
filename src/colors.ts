export class RGB {
    private _red: number
    private _green: number
    private _blue: number

    constructor(red: number, green: number, blue: number) {
        this._red = red;
        this._green = green;
        this._blue = blue;
        this.verify();
    }

    public verify() {
        if(this._red < 0) {
            this._red = 0;
        } else if(this._red > 255) {
            this._red = 255;
        }

        if(this._green < 0) {
            this._green = 0;
        } else if(this._green > 255) {
            this._green = 255;
        }

        if(this._blue < 0) {
            this._blue = 0;
        } else if(this._blue > 255) {
            this._blue = 255;
        }
    }

    // MARK: Getters / setters
    public get red(): number { return this.red; }
    public get green(): number { return this.green; }
    public get blue(): number { return this.blue; }

    public set red(x: number) {
        this.red = x;
        this.verify();
    }
    public set green(x: number) {
        this.green = x;
        this.verify();
    }
    public set blue(x: number) {
        this.blue = x;
        this.verify();
    }

    // MARK: Convenience functions
    public cssFormat(): string {
        return "rgb(" + this._red + "," + this._green + "," + this._blue + ")";
    }
}

export class CPGColor {
    static sunflower: RGB = new RGB(244, 184, 66)
    static orchid: RGB = new RGB(160, 99, 186)
    static aqua: RGB = new RGB(121, 198, 226)
    static charcoal: RGB = new RGB(114, 116, 124)
}