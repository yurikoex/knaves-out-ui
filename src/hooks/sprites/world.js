import { Graphics, Loader, Sprite } from 'pixi.js'
const loader = Loader.shared
const resources = loader.resources

export default ({ gameState, dimensions, setGameState, currentPlayer }) => {
    const worldSize = gameState.currentGame.worldSize
    const zoomLevelPercent = currentPlayer.worldZoomLevel / 100
    const gridWidth = 18
    const boardWidth = 8
    const worldPixelSize = worldSize * gridWidth

    const placedLands = gameState.currentGame.players.reduce(
        (placedLands, { placedLand: { placed, gridX, gridY } }) => {
            if (placed) {
                placedLands.push({ gridX, gridY })
            }
            return placedLands
        },
        []
    )

    const needsToPlace = !currentPlayer.placedLand.placed

    const placeBoard = new Sprite(resources.sheet.textures['board.png'])
    placeBoard.width = gridWidth * boardWidth
    placeBoard.height = gridWidth * boardWidth
    placeBoard.position.set(
        currentPlayer.worldPosition.gridX * gridWidth + gridWidth / 2,
        currentPlayer.worldPosition.gridY * gridWidth + gridWidth / 2
    )
    console.log(placedLands)

    const dot = new Graphics()
    dot.beginFill(0xffff00)
    dot.drawCircle(0, 0, gridWidth / 2)
    dot.position.set(
        currentPlayer.worldPosition.gridX * gridWidth + gridWidth / 2,
        currentPlayer.worldPosition.gridY * gridWidth + gridWidth / 2
    )

    dot.visible = false

    const grid = new Graphics()

    grid.beginFill(0x666666)

    grid.lineStyle(7, 0x777777, 1)
    grid.drawRect(0, 0, worldPixelSize, worldPixelSize)

    grid.lineStyle(1, 0x888888, 1)
    for (var y = 0; y < worldSize; y++) {
        for (var x = 0; x < worldSize; x++) {
            grid.drawRect(x * gridWidth, y * gridWidth, gridWidth, gridWidth)
        }
    }

    grid.scale.set(currentPlayer.worldZoomLevel / 100)

    grid.position.x =
        dimensions.width / 2 - grid.width / 2 + currentPlayer.worldOffsetX
    grid.position.y =
        dimensions.height / 2 - grid.height / 2 + currentPlayer.worldOffsetY

    // console.log({
    //     width: grid.width,
    //     height: grid.height,
    //     x: grid.position.x,
    //     y: grid.position.y,
    // })
    const offsetX =
        dimensions.width / 2 - grid.width / 2 + currentPlayer.worldOffsetX
    const offsetY =
        dimensions.height / 2 - grid.height / 2 + currentPlayer.worldOffsetY
    // console.log({ offsetX, offsetY })

    grid.interactive = true
    grid.interactiveChildren = true
    grid.buttonMode = true
    let over = false
    let clicked = false
    grid.on('click', (event) => {
        clicked = true
        // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXCLICK')
        // console.log(
        //     `${currentPlayer.name} clicked x:${currentPlayer.worldPosition.gridX} y:${currentPlayer.worldPosition.gridY}`
        // )
        // console.log(event)
    })
    grid.on('pointerdown', (event) => {
        setTimeout(
            () =>
                clicked
                    ? null
                    : setGameState((state) => ({
                          ...state,
                          currentGame: {
                              ...state.currentGame,
                              players: state.currentGame.players.map((player) =>
                                  player.id === currentPlayer.id
                                      ? {
                                            ...player,
                                            dragging: {
                                                active: true,
                                                x: event.data.global.x,
                                                y: event.data.global.y,
                                            },
                                        }
                                      : { ...player }
                              ),
                          },
                      })),
            180
        )
    })
    grid.on('pointerup', () => {
        // console.log('Stop Dragging')
        setGameState((state) => ({
            ...state,
            currentGame: {
                ...state.currentGame,
                players: state.currentGame.players.map((player) =>
                    player.id === currentPlayer.id
                        ? {
                              ...player,
                              dragging: {
                                  active: false,
                                  x: 0,
                                  y: 0,
                              },
                          }
                        : { ...player }
                ),
            },
        }))
    })
    grid.on('mousemove', (event) => {
        if (over) {
            if (!currentPlayer.dragging.active) {
                //get the position of the mouse
                const x =
                    ((event.data.global.x - offsetX + 4) * 100) /
                    currentPlayer.worldZoomLevel
                const y =
                    ((event.data.global.y - offsetY + 4) * 100) /
                    currentPlayer.worldZoomLevel
                // console.log({ x, y })
                //get the grid position
                const gridX = Math.floor(x / gridWidth)
                const gridY = Math.floor(y / gridWidth)
                // console.log({ gridX, gridY })
                currentPlayer.worldPosition.gridX === gridX &&
                currentPlayer.worldPosition.gridY === gridY
                    ? null
                    : setGameState((state) => ({
                          ...state,
                          currentGame: {
                              ...state.currentGame,
                              players: state.currentGame.players.map((player) =>
                                  player.id === currentPlayer.id
                                      ? {
                                            ...player,
                                            worldPosition: { gridX, gridY },
                                        }
                                      : { ...player }
                              ),
                          },
                      }))

                dot.visible = true
                // console.log('mousemove world')
                // console.log(event.data.global)
            } else {
                //PLAYER DRAGGING
                dot.visible = false
                // console.log(event.data.global.x - currentPlayer.dragging.x)
                // console.log(event.data.global.y - currentPlayer.dragging.y)
                setGameState((state) => ({
                    ...state,
                    currentGame: {
                        ...state.currentGame,
                        players: state.currentGame.players.map((player) =>
                            player.id === currentPlayer.id
                                ? {
                                      ...player,
                                      worldOffsetX:
                                          event.data.global.x -
                                          currentPlayer.dragging.x,
                                      worldOffsetY:
                                          event.data.global.y -
                                          currentPlayer.dragging.y,
                                  }
                                : { ...player }
                        ),
                    },
                }))
            }
        }
    })

    grid.on('mouseover', (event) => {
        over = true
        grid.addChild(dot)

        if (needsToPlace) {
            grid.addChild(placeBoard)
        }
    })
    grid.on('mouseout', (event) => {
        over = false
        dot.visible = false

        grid.removeChild(dot)

        if (needsToPlace) {
            placeBoard.visible = false
            grid.addChild(placeBoard)
        }
    })
    return grid
}
