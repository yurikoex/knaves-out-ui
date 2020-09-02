import { useEffect } from 'haunted'
import { Graphics, Text, NineSlicePlane, Loader } from 'pixi.js'
const loader = Loader.shared
const resources = loader.resources

import debugStats from './sprites/debugStats'
import world from './sprites/world'
import endTurn from './sprites/endTurn'
import resetView from './sprites/resetView'
import mousewheel from './helpers/mousewheel'
import message from './sprites/message'

export default (gameState, dimensions, engine, setGameState) => {
    useEffect(() => {}, [])

    useEffect(() => {
        if (gameState.running && gameState.currentGame.turns.length !== 0) {
            const currentTurn =
                gameState.currentGame.turns[
                    gameState.currentGame.turns.length - 1
                ]

            if (!currentTurn.complete) {
                const currentPlayer =
                    gameState.currentGame.players[currentTurn.index]

                const currentPlayerWorldZoomLevel = currentPlayer.worldZoomLevel

                const mouseWheelListener = mousewheel({
                    currentPlayerWorldZoomLevel,
                    setGameState,
                    currentPlayer,
                })
                window.addEventListener('wheel', mouseWheelListener)

                const worldSprite = world({
                    gameState,
                    dimensions,
                    setGameState,
                    currentPlayer,
                    currentPlayerWorldZoomLevel,
                })

                const messageSprite = message({
                    actor: 'IceQueen',
                    message:
                        'You! Knave! Place\na land to help\rbuild the world\rof Dominatri!',
                    active: currentPlayer.placedLand.placed,
                    dimensions,
                })

                const debugStatsSprite = debugStats(
                    currentTurn,
                    currentPlayer,
                    dimensions
                )

                const endTurnSprite = endTurn({
                    gameState,
                    dimensions,
                    setGameState,
                })

                const resetViewSprite = resetView({
                    gameState,
                    dimensions,
                    setGameState,

                    currentPlayer,
                })

                engine.stage.addChild(worldSprite)
                engine.stage.addChild(endTurnSprite)
                engine.stage.addChild(resetViewSprite)
                engine.stage.addChild(messageSprite)
                engine.stage.addChild(debugStatsSprite)

                return () => {
                    engine.stage.removeChild(worldSprite)
                    engine.stage.removeChild(endTurnSprite)
                    engine.stage.removeChild(resetViewSprite)
                    engine.stage.removeChild(messageSprite)
                    engine.stage.removeChild(debugStatsSprite)
                    window.removeEventListener('wheel', mouseWheelListener)
                }
            }
        }
    }, [
        gameState.running,
        gameState.currentGame.turns,
        gameState.currentGame.players,
        engine,
        dimensions,
    ])
}
