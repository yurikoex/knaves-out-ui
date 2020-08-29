import { Graphics } from 'pixi.js'

export default (gameState, dimensions, setGameState) => {
    const worldSize = gameState.currentGame.worldSize
    const gridWidth = 18
    const worldPixelSize = worldSize * gridWidth

    const dot = new Graphics()
    dot.beginFill(0xffff00)
    dot.drawCircle(0, 0, gridWidth)

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

    grid.scale.set(1)

    grid.position.x = dimensions.width / 2 - grid.width / 2
    grid.position.y = dimensions.height / 2 - grid.height / 2

    console.log(grid.width, grid.height, grid.position.x, grid.position.y)
    const offsetX = worldPixelSize / 2
    console.log(offsetX)

    grid.interactive = true
    grid.interactiveChildren = true
    grid.buttonMode = true
    let over = false
    grid.on('click', (event) => {
        console.log('------GOT HERE')
        console.log(event)
    })
    grid.on('mouseover', (event) => {
        over = true
        grid.addChild(dot)
    })
    grid.on('mouseout', (event) => {
        over = false

        grid.removeChild(dot)
    })
    grid.on('mousemove', (event) => {
        if (over) {
            dot.position.set(event.data.global.x - offsetX, event.data.global.y)
            // console.log('mousemove world')
            // console.log(event.data.global)
        }
    })
    return grid
}
