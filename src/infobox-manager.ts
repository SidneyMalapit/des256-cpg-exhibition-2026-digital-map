import { Infobox } from "./infobox";
import { Region } from "./region";

export class InfoboxManager {
    private static _global = new InfoboxManager();
    public static get global(): InfoboxManager { return InfoboxManager._global; }

    private _displaying: Map<string, Infobox> = new Map()

    public has(ib: Infobox): boolean {
        for(var box of this._displaying.values()) {
            if(box === ib) {
                return true
            }
        }
        return false
    }

    public uidOf(ib: Infobox): string | null {
        for(var [k, v] of this._displaying.entries()) {
            if(v === ib) {
                return k;
            }
        }
        return null;
    }

    public lookup(uid: number): Infobox | null {
        if(!this._displaying.has("" + uid)) return null;
        return this._displaying.get("" + uid)!
    }

    public position(uid: number) {
        // Either use the provided uid or look it up based on the Infobox
        var infobox = this.lookup(uid);
        if(infobox == null) {
            console.error("Attempted position of uid:" + uid + " which isn't managed by this manager.");
            return;
        }

        let rect = document.getElementById("infobox-" + uid)?.getBoundingClientRect();
        if(rect == undefined) return; // not in the dom, can't be positioned. maybe throw an error in the future?

        // Determine the location of the box based on it's assigned region
        // if \.top, then
        //      x => 0 < rand() < (viewport width - rect.width)
        //      y => 0
        // if \.bottom, then
        //      x => 0 < rand() < (viewport width - rect.width)
        //      y => viewport height - rect.height
        // if \.left, then
        //      x => 0
        //      y => 0 < rand() < (viewport height - rect.height)
        // if \.right, then
        //      x => viewport width - rect.width
        //      y => 0 < rand() < (viewport height - rect.height)
        var x, y = 0;
        var screenHeight = window.innerHeight
        var screenWidth = window.innerWidth

        switch(infobox.region) {
            case Region.top:
                y = 0;
                x = Math.random() * (screenWidth - rect.width);
                break;
            case Region.bottom:
                y = screenHeight - rect.height;
                x = Math.random() * (screenWidth - rect.width);
                break;
            case Region.left:
                x = 0;
                y = Math.random() * (screenHeight - rect.height);
                break;
            case Region.right:
                x = screenWidth - rect.width;
                y = Math.random() * (screenHeight - rect.height);
                break;
        }
        
        document.getElementById("infobox-" + uid)!.setAttribute("style", "top:" + y + "px;left:" + x + "px;");
    }

    public display(ib: Infobox) {
        if(this.has(ib)) return; // prevent duplicates

        // Assign a random ID to the infobox so it doesn't get lost in the DOM.
        let uid = (Math.random() * 1000000).toFixed(0);
        this._displaying.set("" + uid, ib);

        // Put the box in the DOM.
        let htmlElem = ib.make();
        htmlElem.id = "infobox-" + uid;
        document.body.appendChild(htmlElem);
    }

    public teardown(ib: Infobox) {
        for(var [k, v] of this._displaying.entries()) {
            if(v === ib) {
                let node = document.getElementById("infobox-" + k);
                if(node != null) {
                    document.body.removeChild(node);
                }

                this._displaying.delete(k);
                break;
            }
        }
    }
}