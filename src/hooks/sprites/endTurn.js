import { Graphics, NineSlicePlane, Text, Loader } from 'pixi.js'
const loader = Loader.shared
const resources = loader.resources

export default (gameState, dimensions, setGameState) => {
    const buttonContainer = new Graphics()

    buttonContainer.lineStyle(4, 0xffd900, 1)
    buttonContainer.drawRect(0, 0, 120, 40)

    buttonContainer.position.x =
        dimensions.width / 2 - buttonContainer.width / 2
    buttonContainer.position.y = dimensions.height - 100

    const button = new NineSlicePlane(resources.button.texture, 2, 2, 2, 2)
    button.width = 30
    button.height = 10
    button.scale.set(4)

    button.position.x = 0
    button.position.y = 0

    button.interactive = true
    button.buttonMode = true
    button.on('click', (event) => {
        setGameState((state) => ({
            ...state,
            currentGame: {
                ...state.currentGame,
                turns: state.currentGame.turns.map((turn) => ({
                    ...turn,
                    complete: true,
                })),
            },
        }))
    })

    const turnTextText = `End Turn`.toUpperCase()
    const turnText = new Text(turnTextText, {
        fontFamily: 'Fira Code',
        fontSize: 20,
        fill: 0x000000,
        align: 'center',
    })
    turnText.anchor.set(0.0)
    turnText.position.x = 10
    turnText.position.y = 10

    buttonContainer.addChild(button)
    buttonContainer.addChild(turnText)
    return buttonContainer
}
