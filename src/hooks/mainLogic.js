import { useEffect } from 'haunted'
import { Graphics, Text, NineSlicePlane, Loader } from 'pixi.js'
const loader = Loader.shared
const resources = loader.resources

import debugStats from './sprites/debugStats'
import world from './sprites/world'
import endTurn from './sprites/endTurn'

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

                const worldSprite = world(gameState, dimensions, setGameState)

                const debugStatsSprite = debugStats(
                    currentTurn,
                    currentPlayer,
                    dimensions
                )

                const endTurnSprite = endTurn(
                    gameState,
                    dimensions,
                    setGameState
                )

                engine.stage.addChild(worldSprite)
                engine.stage.addChild(endTurnSprite)
                engine.stage.addChild(debugStatsSprite)

                return () => {
                    engine.stage.removeChild(worldSprite)
                    engine.stage.removeChild(endTurnSprite)
                    engine.stage.removeChild(debugStatsSprite)
                }
            }
        }
    }, [gameState.running, gameState.currentGame.turns, engine, dimensions])
}
