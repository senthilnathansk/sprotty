/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import "mocha"
import { expect } from "chai"
import { ConsoleLogger } from "../../utils/logging"
import { SModelRoot } from "../../base/model/smodel"
import { EMPTY_ROOT } from "../../base/model/smodel-factory"
import { CommandExecutionContext } from "../../base/commands/command"
import { AnimationFrameSyncer } from "../../base/animations/animation-frame-syncer"
import { SGraphFactory } from "../../graph/sgraph-factory"
import { SNode } from "../../graph/sgraph"
import { SelectAction, SelectCommand, SelectAllAction, SelectAllCommand } from "./select"

function getNode(nodeId: string, model: SModelRoot) {
    return <SNode>model.index.getById(nodeId)
}

function isNodeSelected(nodeId: string, model: SModelRoot) {
    return getNode(nodeId, model).selected
}

function getNodeIndex(nodeId: string, model: SModelRoot) {
    return model.children.indexOf(getNode(nodeId, model))
}

describe('SelectCommand', () => {
    // Setup the GModel
    const modelFactory = new SGraphFactory()
    const myNode0 = {id: 'node0', type: 'node:circle', x: 100, y: 100, selected: true}
    const myNode1 = {id: 'node1', type: 'node:circle', x: 200, y: 200, selected: false}
    const initialModel = modelFactory.createRoot({
        id: 'graph',
        type: 'graph',
        children: [myNode1, myNode0]  // myNode0 is selected, so put at the end
    })
    const lastIndex = initialModel.children.length - 1

    // Create the select action
    const mySelectAction = new SelectAction(
        ['node1'], // selected list
        ['node0']  // deselected list
    )

    // Create the select command
    const cmd = new SelectCommand(mySelectAction)

    // Global so we can carry-over the model, as it's updated,
    // from test case to test case (i,e, select, undo, redo)
    let newModel: SModelRoot

    const context: CommandExecutionContext = {
        root: modelFactory.createRoot(EMPTY_ROOT),
        modelFactory: modelFactory,
        duration: 0,
        modelChanged: undefined!,
        logger: new ConsoleLogger(),
        syncer: new AnimationFrameSyncer()
    }

    it('execute() works as expected', () => {
        // Execute command
        context.root = initialModel
        newModel = cmd.execute(context)

        // Confirm selection is as expected
        expect(true).to.equal(isNodeSelected('node1', newModel))
        expect(false).to.equal(isNodeSelected('node0', newModel))

        // The selected node is moved at the end of the array
        expect(lastIndex).to.equal(getNodeIndex('node1', newModel))
        expect(0).to.equal(getNodeIndex('node0', newModel))
    })

    it('undo() works as expected', () => {
        // Test "undo"
        context.root = newModel
        newModel = cmd.undo(context)

        // Confirm selection is as expected
        expect(true).to.equal(isNodeSelected('node0', newModel))
        expect(false).to.equal(isNodeSelected('node1', newModel))

        // The selected node is moved at the end of the array
        expect(lastIndex).to.equal(getNodeIndex('node0', newModel))
        expect(0).to.equal(getNodeIndex('node1', newModel))
    })

    it('redo() works as expected', () => {
        // Test "redo"
        context.root = newModel
        newModel = cmd.redo(context)

        // Confirm selection is as expected
        expect(true).to.equal(isNodeSelected('node1', newModel))
        expect(false).to.equal(isNodeSelected('node0', newModel))

        // The selected node is moved at the end of the array
        expect(lastIndex).to.equal(getNodeIndex('node1', newModel))
        expect(0).to.equal(getNodeIndex('node0', newModel))
    })
})

describe('SelectAllCommand', () => {
    // Setup the GModel
    const modelFactory = new SGraphFactory()
    const myNode0 = {id: 'node0', type: 'node:circle', x: 100, y: 100, selected: true}
    const myNode1 = {id: 'node1', type: 'node:circle', x: 200, y: 200, selected: false}
    const initialModel = modelFactory.createRoot({
        id: 'graph',
        type: 'graph',
        children: [myNode1, myNode0]
    })

    // Create the select commands
    const selectCmd = new SelectAllCommand(new SelectAllAction(true))
    const deselectCmd = new SelectAllCommand(new SelectAllAction(false))

    // Global so we can carry-over the model, as it's updated,
    // from test case to test case (i,e, select, undo, redo)
    let newModel: SModelRoot

    const context: CommandExecutionContext = {
        root: modelFactory.createRoot(EMPTY_ROOT),
        modelFactory: modelFactory,
        duration: 0,
        modelChanged: undefined!,
        logger: new ConsoleLogger(),
        syncer: new AnimationFrameSyncer()
    }

    it('execute() works as expected', () => {
        // Execute command
        context.root = initialModel
        newModel = selectCmd.execute(context)

        // Confirm selection is as expected
        expect(true).to.equal(isNodeSelected('node0', newModel))
        expect(true).to.equal(isNodeSelected('node1', newModel))
    })

    it('undo() works as expected', () => {
        // Test "undo"
        context.root = newModel
        newModel = selectCmd.undo(context)

        // confirm selection is as expected
        expect(true).to.equal(isNodeSelected('node0', newModel))
        expect(false).to.equal(isNodeSelected('node1', newModel))
    })

    it('redo() works as expected', () => {
        // Test "redo"
        context.root = newModel
        newModel = selectCmd.redo(context)

        // Confirm selection is as expected
        expect(true).to.equal(isNodeSelected('node0', newModel))
        expect(true).to.equal(isNodeSelected('node1', newModel))
    })

    it('execute() works as expected with deselect', () => {
        // Execute command with deselect: true
        context.root = newModel
        newModel = deselectCmd.execute(context)

        // Confirm selection is as expected
        expect(false).to.equal(isNodeSelected('node0', newModel))
        expect(false).to.equal(isNodeSelected('node1', newModel))
    })

    it('undo() works as expected with deselect', () => {
        // Test "undo" with deselect: true
        context.root = newModel
        newModel = deselectCmd.undo(context)

        // confirm selection is as expected
        expect(true).to.equal(isNodeSelected('node0', newModel))
        expect(true).to.equal(isNodeSelected('node1', newModel))
    })

    it('redo() works as expected with deselect', () => {
        // Test "redo" with deselect: true
        context.root = newModel
        newModel = deselectCmd.redo(context)

        // Confirm selection is as expected
        expect(false).to.equal(isNodeSelected('node0', newModel))
        expect(false).to.equal(isNodeSelected('node1', newModel))
    })
})
