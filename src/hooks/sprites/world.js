import { Graphics } from 'pixi.js'

export default ({ gameState, dimensions, setGameState, currentPlayer }) => {
    const worldSize = gameState.currentGame.worldSize
    const gridWidth = 18
    const worldPixelSize = worldSize * gridWidth

    const dot = new Graphics()
    dot.beginFill(0xffff00)
    dot.drawCircle(0, 0, gridWidth / 2)
    dot.position.set(
        currentPlayer.worldPosition.gridX * gridWidth + gridWidth / 2,
        currentPlayer.worldPosition.gridY * gridWidth + gridWidth / 2
    )

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

    grid.position.x = dimensions.width / 2 - grid.width / 2
    grid.position.y = dimensions.height / 2 - grid.height / 2

    console.log(grid.width, grid.height, grid.position.x, grid.position.y)
    const offsetX = dimensions.width / 2 - worldPixelSize / 2
    const offsetY = dimensions.height / 2 - worldPixelSize / 2
    console.log(offsetX, offsetY)

    grid.interactive = true
    grid.interactiveChildren = true
    grid.buttonMode = true
    let over = false
    grid.on('click', (event) => {
        console.log('------GOT HERE')
        console.log(event)
    })
    grid.on('mousemove', (event) => {
        if (over) {
            const x =
                ((event.data.global.x - offsetX + 4) * 100) /
                currentPlayer.worldZoomLevel
            const y =
                ((event.data.global.y - offsetY + 4) * 100) /
                currentPlayer.worldZoomLevel
            const gridX = Math.floor(x / gridWidth)
            const gridY = Math.floor(y / gridWidth)
            console.log(gridX, gridY)
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
        }
    })

    grid.on('mouseover', (event) => {
        over = true
        grid.addChild(dot)
    })
    grid.on('mouseout', (event) => {
        over = false
        dot.visible = false

        grid.removeChild(dot)
    })
    return grid
}
