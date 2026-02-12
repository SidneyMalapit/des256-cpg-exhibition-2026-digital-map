export enum Region {
    left, right, top, bottom
}

export function inverseRegion(region: Region): Region {
    switch(region) {
        case Region.left: return Region.right
        case Region.right: return Region.left
        case Region.top: return Region.bottom
        case Region.bottom: return Region.top
    }
}