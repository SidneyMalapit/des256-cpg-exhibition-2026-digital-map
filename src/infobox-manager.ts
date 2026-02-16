import { Infobox } from "./infobox";
import { Region } from "./region";
import { modifyStyleLine } from "./util";

// Manages infoboxes actually displayed on the screen
//
// Figures out the actual position based on the box's preferred region
// Assigns the infobox an id once it's displayed which corresponds to a div in the DOM
export class InfoboxManager {
    private static _global = new InfoboxManager();
    public static get global(): InfoboxManager { return InfoboxManager._global; }

    private _displaying: Map<number, Infobox> = new Map()

    // If a given Infobox is being displayed on the screen
    public has(ib: Infobox): boolean {
        for(var box of this._displaying.values()) {
            if(box === ib) {
                return true
            }
        }
        return false
    }

    // Finds the assigned uid of an Infobox
    //
    // If it's not being displayed, returns null
    // Otherwise, returns the uid.
    public uidOf(ib: Infobox): number | null {
        for(var [k, v] of this._displaying.entries()) {
            if(v === ib) {
                return k;
            }
        }
        return null;
    }

    // Finds the Infobox object given it's assigned uid.
    //
    // If it's not being displayed, returns null
    // Otherwise, returns the Infobox
    public lookup(uid: number): Infobox | null {
        if(!this._displaying.has(uid)) return null;
        return this._displaying.get(uid)!
    }

    // Positions an infobox using it's assigned [region].
    // The infobox must already be in the DOM.
    //
    // Takes in a uid which is assigned during [display()]
    //
    // [display()] calls this function automatically, you probably don't need to be calling this.
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

        var oldLine = document.getElementById("infobox-" + uid)!.getAttribute("style");
        var newStyleLine = modifyStyleLine(oldLine, "top", "" + Math.floor(y) + "px");
        newStyleLine = modifyStyleLine(newStyleLine, "left", "" + Math.floor(x) + "px");
        
        document.getElementById("infobox-" + uid)!.setAttribute("style", newStyleLine);
    }

    // Displays an infobox in the DOM.
    // 
    // Assigns the infobox a uid which is used to identify it in the DOM.
    // Calls the infobox's [make()] function and places the result in the DOM.
    // Then calls [position()], passing in the uid.
    public display(ib: Infobox) {
        if(this.has(ib)) return; // prevent duplicates

        // Assign a random ID to the infobox so it doesn't get lost in the DOM.
        let uid = Math.floor(Math.random() * 1000000);
        this._displaying.set(uid, ib);

        // Put the box in the DOM.
        let htmlElem = ib.make();
        htmlElem.id = "infobox-" + uid;
        document.body.appendChild(htmlElem);

        // Position it on screen
        this.position(uid);
    }

    public teardown(uid: number) {
        if(!this._displaying.has(uid)) return;

        document.body.removeChild(document.getElementById("infobox-" + uid)!);
        this._displaying.delete(uid);
    }

    public draw() {
        if(this._displaying.size == 0) return; // nothing to draw.

        let svg = document.getElementById("ib-paths") as SVGSVGElement | null;
        if(svg == null) {
            console.error("Cannot draw infobox tails, query for id:ib-paths was null.");
            return;
        }

        svg.innerHTML = "";

        let imgOffset = document.getElementById("map")!.getBoundingClientRect();
        var imgOffsetY = imgOffset.y;
        var imgOffsetX = imgOffset.x;

        for(var [id, infobox] of this._displaying) {
            let ibElem = document.getElementById("infobox-" + id);
            if(ibElem == null) {
                console.warn("Dom query for infobox id:" + id + " failed, InfoboxManager._displaying might be out of sync.");
                continue;
            }

            if(infobox.anchorId == null) {
                console.warn("Displayed infobox id:" + id + " has no anchor.");
                continue;
            }

            let anchorElem = document.getElementById(infobox.anchorId);
            if(anchorElem == null) {
                console.error("infobox id:" + id + " specified anchor id:" + infobox.anchorId + " is not in the DOM.");
                continue;
            }

            let coords = anchorElem.getAttribute("coords");
            if(coords == null) {
                console.error("anchor id:" + infobox.anchorId + " has no coords.");
                continue;
            }

            let coordsArr = coords.split(",");
            if(coordsArr.length < 2) {
                console.error("anchor id:" + infobox.anchorId + " has invalid coords.");
                continue;
            }

            let anchorX = Number.parseInt(coordsArr[0]);
            let anchorY = Number.parseInt(coordsArr[1]);
            if(Number.isNaN(anchorX) || Number.isNaN(anchorY)) {
                console.error("anchor id:" + infobox.anchorId + " has invalid coords. (NaN)");
                continue;
            }

            let anchorPt = svg.createSVGPoint();
            anchorPt.x = anchorX + imgOffsetX;
            anchorPt.y = anchorY + imgOffsetY;

            let ibRect = ibElem.getBoundingClientRect();

            switch(infobox.region) {
                case Region.top:
                    let maxX = ibRect.right;
                    let minX = ibRect.left;
                    let y = ibRect.height;

                    let leftBound = minX + ((maxX - minX) / 2) - 30
                    let rightBound = minX + ((maxX - minX) / 2) + 30

                    let lbPt = svg.createSVGPoint()
                    lbPt.x = leftBound;
                    lbPt.y = y;

                    let rbPt = svg.createSVGPoint()
                    rbPt.x = rightBound;
                    rbPt.y = y;

                    let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                    poly.points.appendItem(anchorPt);
                    poly.points.appendItem(lbPt);
                    poly.points.appendItem(rbPt);
                    
                    poly.setAttribute("fill", infobox.color.cssFormat()); // cssFmt.cssFormat()

                    svg.appendChild(poly);
                    break;
                case Region.bottom:
                    // TODO: implement the rest of these cases.
                    break;
                case Region.left:
                    break;
                case Region.right:
                    break;
            }
        }
    }
}