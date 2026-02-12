import { InfoboxDataset } from "./infobox-data";
import { InfoboxManager } from "./infobox-manager";

export function show(id: number) {
    let fromDataset = InfoboxDataset.global.infobox(id);
    if(fromDataset == null) {
        console.error("Infobox with id:" + id + " doesn't exist in the dataset.");
        return;
    }

    InfoboxManager.global.display(fromDataset);
}

window.onload = async () => {
    await InfoboxDataset.global.fetchFromServer()
}