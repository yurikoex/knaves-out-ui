import { Graphics } from 'pixi.js'

export default (gameState, dimensions) => {
    const worldSize = gameState.currentGame.worldSize

    const grid = new Graphics()

    grid.lineStyle(4, 0xffffff, 1)
    for (var y = 0; y < worldSize; y++) {
        for (var x = 0; x < worldSize; x++) {
            grid.drawRect(x * 20, y * 20, 20, 20)
        }
    }

    grid.scale.set(1)

    grid.position.x = dimensions.width / 2 - grid.width / 2
    grid.position.y = dimensions.height / 2 - grid.height / 2
    return grid
}
