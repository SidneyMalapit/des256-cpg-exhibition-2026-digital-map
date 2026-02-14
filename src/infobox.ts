import { RGB } from "./colors";
import { Region } from "./region";

// Holds information about a vendor that is used to populate an infobox
//
// Also holds a preferred [region] which is used to position the infobox on the screen once it's displayed.
export class Infobox {
    private _name: string
    private _handle: string
    private _handleHref: string | undefined;
    private _description: string[]
    private _color: RGB
    public set color(value: RGB) { this._color = value; }

    // Box positioning, for use by [InfoboxManager]
    public region: Region = Region.top;
    public anchor: [x: number, y: number] = [0, 0]

    constructor(name: string, handle: string, handleHref: string | undefined, description: string[], color: RGB) {
        this._name = name;
        this._handle = handle;
        this._handleHref = handleHref;
        this._description = description;
        this._color = color;
    }

    // Constructs the infobox for display on the screen.
    // Does not actually put the div into the DOM here.
    //
    // ------------------------------
    // | [_name]                    |
    // | [_handle]                  |
    // |                            |
    // |  [_description[0]]         |
    // |  [_description[1]]         |
    // |  [...]                     |
    // ------------------------------
    public make(): HTMLDivElement {
        var container = document.createElement("div");
        container.classList.add("infobox");
        container.style = "background-color: " + this._color.cssFormat();

        // ** Header
        let name = document.createElement("h1");
        name.innerText = this._name;
        name.classList.add("cooper");

        let handle = document.createElement("a");
        handle.innerText = this._handle;
        if(this._handleHref != undefined) {
            handle.setAttribute("href", this._handleHref);
        }

        container.appendChild(name);
        container.appendChild(handle);

        // ** Description
        for(var paragraph of this._description) {
            let x = document.createElement("p");
            x.innerText = paragraph;
            container.appendChild(x);
        }

        return container;
    }
}