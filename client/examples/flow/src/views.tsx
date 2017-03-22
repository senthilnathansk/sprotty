import {h} from "snabbdom"
import {VNode} from "snabbdom/vnode"
import {RenderingContext} from "../../../src/base"
import {SNode, SNodeView} from "../../../src/graph"
import {Point} from "../../../src/utils"
import * as snabbdom from "snabbdom-jsx"

const JSX = {createElement: snabbdom.svg}

export class ExecutionNodeView extends SNodeView {
    render(node: SNode, context: RenderingContext): VNode {
        const radius = this.getRadius(node)
        return <g key={node.id} id={node.id} >
                <circle class-node={true} class-selected={node.selected} r={radius} x={radius / 2} y={radius / 2}></circle>
            </g>
    }

    private getRadius(node: SNode) {
        return 30
    }

    getAnchor(node: SNode, refPoint: Point, arrowLength: number) {
        const dx = node.x - refPoint.x
        const dy = node.y - refPoint.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const normX = dx / distance
        const normY = dy / distance
        return {
            x: node.x - normX * (this.getRadius(node) + arrowLength),
            y: node.y - normY * (this.getRadius(node) + arrowLength)
        }
    }
}

export class BarrierNodeView extends SNodeView {
    render(node: SNode, context: RenderingContext): VNode {
        return <g key={node.id} id={node.id} >
                <rect class-node={true} class-selected={node.selected} width={this.getWidth(node)} height={this.getHeight(node)}></rect>
            </g>
    }

    private getWidth(node: SNode) {
        return 40
    }

    private getHeight(node: SNode) {
        return 8
    }

    getAnchor(node: SNode, refPoint: Point, arrowLength: number) {
        let x = refPoint.x
        if (x < node.x)
            x = node.x
        else if (x > node.x + this.getWidth(node))
            x = node.x + this.getWidth(node)
        let y = refPoint.y
        if (y < node.y)
            y = node.y
        else if (y > node.y + this.getWidth(node))
            y = node.y + this.getWidth(node)
        return {x, y}
    }
}