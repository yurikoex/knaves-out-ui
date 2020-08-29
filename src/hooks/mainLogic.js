import { useEffect } from 'haunted'
import { Graphics, Text, NineSlicePlane, Loader } from 'pixi.js'
const loader = Loader.shared
const resources = loader.resources

export default (gameState, dimensions, engine, setGameState) => {
    useEffect(() => {
        if (gameState.running && gameState.currentGame.turns.length !== 0) {
            const currentTurn =
                gameState.currentGame.turns[
                    gameState.currentGame.turns.length - 1
                ]

            if (!currentTurn.complete) {
                const currentPlayer =
                    gameState.currentGame.players[currentTurn.index]

                const gridSize = gameState.currentGame.players.length * 10

                const grid = new Graphics()
                grid.lineStyle(4, 0xffffff, 1)
                for (var y = 0; y < gridSize; y++) {
                    for (var x = 0; x < gridSize; x++) {
                        grid.drawRect(x * 20, y * 20, 20, 20)
                    }
                }

                grid.scale.set(1)

                grid.position.x = dimensions.width / 2 - grid.width / 2
                grid.position.y = dimensions.height / 2 - grid.height / 2

                const debugText = `Total Turns ${currentTurn.num}
Round: ${currentTurn.round}
ID: ${currentPlayer.id}
Name: ${currentPlayer.name}
Players Turn: ${currentPlayer.turns + 1}
Placed Land: ${currentPlayer.placedLand}
Deck: ${currentPlayer.deck.length}
Discard: ${currentPlayer.discard.length}
Court In Play: ${currentPlayer.court.reduce((t, c) => (c.card ? t + 1 : t), 0)}
Knave: ${currentPlayer.court.find((c) => c.type === 'knave').card}
Queen: ${currentPlayer.court.find((c) => c.type === 'queen').card}
King: ${currentPlayer.court.find((c) => c.type === 'king').card}
Knave: ${currentPlayer.court.find((c) => c.type === 'aos').card}
                `.toUpperCase()
                const debugStats = new Text(debugText, {
                    fontFamily: 'Fira Code',
                    fontSize: 24,
                    fill: 0xffffff,
                    align: 'left',
                })
                debugStats.anchor.set(0)
                debugStats.position.x = 10
                debugStats.position.y = 10

                const buttonContainer = new Graphics()

                buttonContainer.lineStyle(4, 0xffd900, 1)
                buttonContainer.drawRect(0, 0, 120, 40)

                buttonContainer.position.x =
                    dimensions.width / 2 - buttonContainer.width / 2
                buttonContainer.position.y = dimensions.height - 100

                let button = new NineSlicePlane(
                    resources.button.texture,
                    2,
                    2,
                    2,
                    2
                )
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
                engine.stage.addChild(grid)
                engine.stage.addChild(buttonContainer)
                engine.stage.addChild(debugStats)

                let rotation = 0
                const animationCancelToken = setInterval(() => {
                    rotation = rotation <= 360 ? rotation + 1 : 0
                    const pulseScale = Math.sin(rotation * 0.1) * 0.05 + 1
                    // turnText.scale.set(pulseScale)
                }, 1000 / 15)

                return () => {
                    engine.stage.removeChild(grid)
                    engine.stage.removeChild(buttonContainer)
                    engine.stage.removeChild(debugStats)
                    clearInterval(animationCancelToken)
                }
            }
        }
    }, [gameState.running, gameState.currentGame.turns, engine, dimensions])
}
