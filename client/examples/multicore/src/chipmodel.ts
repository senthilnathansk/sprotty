import {SModelRoot, SModelElementSchema, SChildElement} from "../../../src/base"
import {Direction, Point, ORIGIN_POINT, EMPTY_BOUNDS, Bounds} from "../../../src/utils"
import {
    Selectable, selectFeature, BoundsAware, boundsFeature, Viewport, viewportFeature
} from "../../../src/features"
import {ViewportRootElement} from "../../../src/features/viewport/viewport-root"

export interface ChipSchema extends SModelElementSchema {
    rows: number
    columns: number
    children: SModelElementSchema[]
}

export class Chip extends ViewportRootElement implements ChipSchema {
    readonly rows: number
    readonly columns: number

    hasFeature(feature: symbol): boolean {
        return feature === viewportFeature || feature === boundsFeature
    }
}

export interface CoreSchema extends SModelElementSchema {
    row: number
    column: number
    load: number
    selected?: boolean
}

export class Core extends SChildElement implements CoreSchema, Selectable {
    readonly column: number
    readonly row: number
    load: number
    selected: boolean = false

    hasFeature(feature: symbol): boolean {
        return feature === selectFeature
    }
}

export interface CrossbarSchema extends SModelElementSchema {
    selected?: boolean
    direction: Direction
    load: number
}


export class Crossbar extends SChildElement implements CrossbarSchema, Selectable, BoundsAware {
    readonly direction: Direction
    load: number
    selected: boolean = false
    autosize: boolean = true
    bounds: Bounds = EMPTY_BOUNDS

    hasFeature(feature: symbol): boolean {
        return feature === selectFeature || feature === boundsFeature
    }
}

export interface ChannelSchema extends SModelElementSchema {
    row: number
    column: number
    direction: Direction
    selected?: boolean
    load: number
}

export class Channel extends SChildElement implements ChannelSchema, Selectable {
    readonly column: number
    readonly row: number
    readonly direction: Direction
    load: number
    selected: boolean = false

    hasFeature(feature: symbol): boolean {
        return feature === selectFeature
    }
}


