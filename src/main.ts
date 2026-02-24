import { CPGColor } from "./colors";
import { InfoboxDataset } from "./infobox-data";
import { InfoboxManager } from "./infobox-manager";

export function show(id: number, cpgColor: string, anchorId: string) {
    // Check if the infobox is already showing based on the dataset ID
    // If already showing an infobox, remove it.
    let existingId = InfoboxDataset.global.getRelation(id);
    if(existingId != undefined) {
        InfoboxManager.global.teardown(existingId);
        InfoboxDataset.global.removeRelation(id);
        return;
    }

    // Else, show it.

    let fromDataset = InfoboxDataset.global.infobox(id);
    if(fromDataset == null) {
        console.error("Infobox with id:" + id + " doesn't exist in the dataset.");
        return;
    }

    fromDataset.anchorId = anchorId;

    switch(cpgColor) {
        case "orchid":
            fromDataset.color = CPGColor.orchid;
            break;
        case "sunflower":
            fromDataset.color = CPGColor.sunflower;
            break;
        case "aqua":
            fromDataset.color = CPGColor.aqua;
            break;
        default:
            console.warn("Specified color '" + cpgColor + "' is not a valid CPGColor name.");
            fromDataset.color = CPGColor.charcoal;
            break;
    }

    let uid = InfoboxManager.global.display(fromDataset);
    InfoboxManager.global.draw();

    if(uid != null) {
        InfoboxDataset.global.relate(id, uid);
    }
}

window.onload = async () => {
    await InfoboxDataset.global.fetchFromServer()

    addEventListener("scroll", (_) => {
        InfoboxManager.global.draw();
    });

    addEventListener("resize", (_) => {
        InfoboxManager.global.draw();
    });
}