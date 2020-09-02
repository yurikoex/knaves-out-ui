import { Graphics, NineSlicePlane, Text, Loader } from 'pixi.js'
const loader = Loader.shared
const resources = loader.resources

export default ({ gameState, dimensions, setGameState, currentPlayer }) => {
    const buttonContainer = new Graphics()

    buttonContainer.lineStyle(4, 0xffd900, 1)
    buttonContainer.drawRect(0, 0, 142, 40)

    buttonContainer.position.x =
        dimensions.width / 2 - buttonContainer.width / 2 - 150
    buttonContainer.position.y = dimensions.height - 100

    const button = new NineSlicePlane(resources.button.texture, 2, 2, 2, 2)
    button.width = 35.5
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
                players: state.currentGame.players.map((player) =>
                    player.id === currentPlayer.id
                        ? {
                              ...player,
                              worldZoomLevel: 100,
                              dragging: { active: false, x: 0, y: 0 },
                              worldOffsetX: 0,
                              worldOffsetY: 0,
                              worldPosition: { gridX: 0, gridY: 0 },
                          }
                        : { ...player }
                ),
            },
        }))
    })

    const turnTextText = `Reset View`.toUpperCase()
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
