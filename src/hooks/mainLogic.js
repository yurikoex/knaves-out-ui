import { useEffect } from 'haunted'
import { Graphics, Text, NineSlicePlane, Loader } from 'pixi.js'
const loader = Loader.shared
const resources = loader.resources

import debugStats from './sprites/debugStats'
import world from './sprites/world'

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

                const worldSprite = world(gameState, dimensions)

                const debugStatsSprite = debugStats(
                    currentTurn,
                    currentPlayer,
                    dimensions
                )

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
                engine.stage.addChild(worldSprite)
                engine.stage.addChild(buttonContainer)
                engine.stage.addChild(debugStatsSprite)

                let rotation = 0
                const animationCancelToken = setInterval(() => {
                    rotation = rotation <= 360 ? rotation + 1 : 0
                    const pulseScale = Math.sin(rotation * 0.1) * 0.05 + 1
                    // turnText.scale.set(pulseScale)
                }, 1000 / 15)

                return () => {
                    engine.stage.removeChild(worldSprite)
                    engine.stage.removeChild(buttonContainer)
                    engine.stage.removeChild(debugStatsSprite)
                    clearInterval(animationCancelToken)
                }
            }
        }
    }, [gameState.running, gameState.currentGame.turns, engine, dimensions])
}
