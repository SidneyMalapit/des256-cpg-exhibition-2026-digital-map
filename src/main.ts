import { CPGColor } from "./colors";
import { InfoboxDataset } from "./infobox-data";
import { InfoboxManager } from "./infobox-manager";

export function show(id: number, cpgColor: string) {
    let fromDataset = InfoboxDataset.global.infobox(id);
    if(fromDataset == null) {
        console.error("Infobox with id:" + id + " doesn't exist in the dataset.");
        return;
    }

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

    InfoboxManager.global.display(fromDataset);
}

window.onload = async () => {
    await InfoboxDataset.global.fetchFromServer()
}