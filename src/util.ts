// Takes in a CSS style line and inserts / replaces a key-value pair.
//
// Ex:
// modifyStyleLine("top: 67px; left: 12px", "left", "10px") => "top: 67px;left: 10px"
// modifyStyleLine("top: 12px; right: 10px", "bottom", "12px") => "top: 12px;right: "
export function modifyStyleLine(oldLine: string | null, key: string, value: string): string {
    if(oldLine == null) {
        return key + ": " + value + ";";
    }

    // Trim trailing semicolons (leads to ;; in the end result.)
    if(oldLine.endsWith(";")) {
        oldLine = oldLine.substring(0, oldLine.length - 1);
    }

    // Iterate through the array, try to find existing [key]
    var oldLineArr = oldLine.split(";");
    var placed = false;
    for(var i = 0; i < oldLineArr.length; i++) {
        if(oldLineArr.at(i)!.trim().startsWith(key)) {
            oldLineArr[i] = key + ": " + value;
            placed = true;
            break;
        }
    }

    // If it's not already in the style line, append it.
    if(!placed) {
        oldLineArr.push(key + ": " + value);
    }

    return oldLineArr.join(";");
}