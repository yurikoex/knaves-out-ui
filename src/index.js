import { component, useState, useEffect, State, useMemo } from 'haunted'
import * as PIXI from 'pixi.js'
import Peer from 'peerjs'
import css from './style.css'

import useInit from './hooks/init'
import useResize from './hooks/resize'
import useResponsive from './hooks/responsive'
import useLoader from './hooks/loader'
import useLoaded from './hooks/loaded'
import useGameStartup from './hooks/gameStartup'
import useMainMenu from './hooks/mainMenu'
import useNewGame from './hooks/newGame'
import useTurns from './hooks/turns'

const Application = PIXI.Application
const loader = PIXI.Loader.shared
const resources = loader.resources
const Sprite = PIXI.Sprite
const NineSlicePlane = PIXI.NineSlicePlane
const Graphics = PIXI.Graphics

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

PIXI.utils.TextureCache['images/logo.png']
PIXI.utils.TextureCache['images/spritesheet.png']

const App = () => {
    const [engine, setEngine] = useState(null)
    // const [stage, setStage] = useState(null)
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })
    const [loading, setLoading] = useState(true)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [sprites, setSprites] = useState({ loaded: false })
    const [gameState, setGameState] = useState({
        running: false,
        currentGame: { turns: [], players: [] },
        players: [
            {
                id: 1,
                name: 'gabe',
            },
            {
                id: 2,
                name: 'josh',
            },
            {
                id: 3,
                name: 'tyson',
            },
            {
                id: 4,
                name: 'mikey',
            },
        ],
        mainMenuVisible: false,
    })

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
                const debugStats = new PIXI.Text(debugText, {
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
                const turnText = new PIXI.Text(turnTextText, {
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
    }, [gameState.running, gameState.currentGame.turns, dimensions])

    useTurns(gameState, setGameState)

    const newGame = useNewGame(gameState, setGameState)

    useMainMenu(dimensions, gameState, engine, sprites, newGame)

    useGameStartup(gameState, loadingProgress, loading, sprites, setGameState)

    useLoaded(loading, loadingProgress, setSprites)

    useLoader(loading, setLoadingProgress, setLoading)

    useResponsive(engine, dimensions)

    useResize(setDimensions)

    useInit(setEngine, dimensions)

    return null
}
customElements.define('knaves-out', component(App))
