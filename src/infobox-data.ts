import { CPGColor } from "./colors";
import { Infobox } from "./infobox";

export class InfoboxDataset {
    public static global: InfoboxDataset = new InfoboxDataset()

    private _dataset: Map<number, {id: string, name: string, handle: string, handleHref: string | undefined, description: string[]}> = new Map();

    public async fetchFromServer() {
        // Get the data from the server
        let resp = await fetch("/data/vendors.json");
        if(!resp.ok) {
            console.error("Failed to get vendor data from the server.");
            return;
        }

        // Iterate over the array and place into _dataset
        let data = await resp.json();
        for(var arr of data) {
            if(arr["id"] == undefined) {
                continue;
            }
            this._dataset.set(arr["id"], arr);
        }

        console.log(this._dataset);
    }

    public infobox(id: number): Infobox | null {
        let data = this._dataset.get(id);
        if(data == undefined) return null;

        return new Infobox(data.name, data.handle, data.handleHref, data.description, CPGColor.orchid)
    }
} 