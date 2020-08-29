import { component, useState, useEffect, State, useMemo } from 'haunted'
import * as PIXI from 'pixi.js'
import { CRTFilter } from '@pixi/filter-crt'
import Peer from 'peerjs'
import css from './style.css'
import './images/KnavesOutLogo.png'
import './images/logo.png'
import './images/button.png'
import spritesheetData from './images/spritesheet.json'
import './images/spritesheet.png'

console.log(spritesheetData)

const Application = PIXI.Application
const loader = PIXI.Loader.shared
const resources = loader.resources
const Sprite = PIXI.Sprite
const NineSlicePlane = PIXI.NineSlicePlane
const Graphics = PIXI.Graphics

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

PIXI.utils.TextureCache['images/logo.png']
PIXI.utils.TextureCache['images/spritesheet.png']

const getNewDeck = () => {
    let deck = [
        {
            suit: 'hearts',
            value: 2,
        },
        {
            suit: 'hearts',
            value: 3,
        },
        {
            suit: 'hearts',
            value: 4,
        },
        {
            suit: 'hearts',
            value: 5,
        },
        {
            suit: 'hearts',
            value: 6,
        },
        {
            suit: 'hearts',
            value: 7,
        },
        {
            suit: 'hearts',
            value: 8,
        },
        {
            suit: 'hearts',
            value: 9,
        },
        {
            suit: 'hearts',
            value: 10,
        },
        {
            suit: 'hearts',
            value: 'J',
        },
        {
            suit: 'hearts',
            value: 'Q',
        },
        {
            suit: 'hearts',
            value: 'K',
        },
        {
            suit: 'hearts',
            value: 'A',
        },
        {
            suit: 'diamonds',
            value: 2,
        },
        {
            suit: 'diamonds',
            value: 3,
        },
        {
            suit: 'diamonds',
            value: 4,
        },
        {
            suit: 'diamonds',
            value: 5,
        },
        {
            suit: 'diamonds',
            value: 6,
        },
        {
            suit: 'diamonds',
            value: 7,
        },
        {
            suit: 'diamonds',
            value: 8,
        },
        {
            suit: 'diamonds',
            value: 9,
        },
        {
            suit: 'diamonds',
            value: 10,
        },
        {
            suit: 'diamonds',
            value: 'J',
        },
        {
            suit: 'diamonds',
            value: 'Q',
        },
        {
            suit: 'diamonds',
            value: 'K',
        },
        {
            suit: 'diamonds',
            value: 'A',
        },
        {
            suit: 'clubs',
            value: 2,
        },
        {
            suit: 'clubs',
            value: 3,
        },
        {
            suit: 'clubs',
            value: 4,
        },
        {
            suit: 'clubs',
            value: 5,
        },
        {
            suit: 'clubs',
            value: 6,
        },
        {
            suit: 'clubs',
            value: 7,
        },
        {
            suit: 'clubs',
            value: 8,
        },
        {
            suit: 'clubs',
            value: 9,
        },
        {
            suit: 'clubs',
            value: 10,
        },
        {
            suit: 'clubs',
            value: 'J',
        },
        {
            suit: 'clubs',
            value: 'Q',
        },
        {
            suit: 'clubs',
            value: 'K',
        },
        {
            suit: 'clubs',
            value: 'A',
        },
        {
            suit: 'spades',
            value: 2,
        },
        {
            suit: 'spades',
            value: 3,
        },
        {
            suit: 'spades',
            value: 4,
        },
        {
            suit: 'spades',
            value: 5,
        },
        {
            suit: 'spades',
            value: 6,
        },
        {
            suit: 'spades',
            value: 7,
        },
        {
            suit: 'spades',
            value: 8,
        },
        {
            suit: 'spades',
            value: 9,
        },
        {
            suit: 'spades',
            value: 10,
        },
        {
            suit: 'spades',
            value: 'J',
        },
        {
            suit: 'spades',
            value: 'Q',
        },
        {
            suit: 'spades',
            value: 'K',
        },
        {
            suit: 'spades',
            value: 'A',
        },
        {
            suit: 'Joker',
            value: 'Joker',
        },
        {
            suit: 'Joker',
            value: 'Joker',
        },
    ]
    const shuffled = []
    while (deck.length !== 0) {
        const [randomCard] = deck.splice(
            Math.floor(Math.random() * deck.length),
            1
        )
        shuffled.push(randomCard)
    }
    return shuffled
}

const generateNewGamePlayer = ({ id, name }) => ({
    id,
    name,
    deck: getNewDeck(),
    discard: [],
    court: [
        { type: 'knave', card: null, joker: null, devoured: [], tower: [] },
        { type: 'queen', card: null, joker: null, devoured: [], tower: [] },
        { type: 'king', card: null, joker: null, devoured: [], tower: [] },
        { type: 'aos', card: null, joker: null, devoured: [], tower: [] },
    ],
    placedLand: null,
    order: Math.floor(Math.random() * 1000000000),
    turns: 0,
})

const App = () => {
    const [engine, setEngine] = useState(null)
    const [stage, setStage] = useState(null)
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

                const grid = new Graphics()
                grid.lineStyle(4, 0xffffff, 1)
                for (
                    var y = 0;
                    y < gameState.currentGame.players.length * 10;
                    y++
                ) {
                    for (
                        var x = 0;
                        x < gameState.currentGame.players.length * 10;
                        x++
                    ) {
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

    //ROTATE Turns
    useEffect(() => {
        if (gameState.running && gameState.currentGame.turns.length === 0) {
            setGameState((state) => ({
                ...state,
                currentGame: {
                    ...state.currentGame,
                    turns: [
                        {
                            index: 0,
                            complete: false,
                            num: 1,
                            round: 1,
                        },
                    ],
                },
            }))
        } else if (
            gameState.running &&
            gameState.currentGame.turns[gameState.currentGame.turns.length - 1]
                .complete
        ) {
            const lastTurnIndex =
                gameState.currentGame.turns[
                    gameState.currentGame.turns.length - 1
                ].index
            const lastTurnNum =
                gameState.currentGame.turns[
                    gameState.currentGame.turns.length - 1
                ].num
            const lastRound =
                gameState.currentGame.turns[
                    gameState.currentGame.turns.length - 1
                ].round
            const numPlayersZeroBased = gameState.currentGame.players.length - 1
            setGameState((state) => ({
                ...state,
                currentGame: {
                    ...state.currentGame,
                    players: state.currentGame.players.map((player, i) =>
                        i === lastTurnIndex
                            ? {
                                  ...player,
                                  turns: player.turns + 1,
                              }
                            : { ...player }
                    ),
                    turns: [
                        ...gameState.currentGame.turns,
                        {
                            index:
                                lastTurnIndex === numPlayersZeroBased
                                    ? 0
                                    : lastTurnIndex + 1,
                            complete: false,
                            num: lastTurnNum + 1,
                            round:
                                lastTurnIndex === numPlayersZeroBased
                                    ? lastRound + 1
                                    : lastRound,
                        },
                    ],
                },
            }))
        }
    }, [gameState.running, gameState.currentGame.turns])

    const newGame = useMemo(
        () => (event) => {
            const orderedPlayers = gameState.players
                .map((player) => generateNewGamePlayer(player))
                .sort((a, b) => (a.order > b.order ? -1 : 1))
            const newGameConfig = {
                players: orderedPlayers,
                turns: [],
            }
            setGameState((state) => ({
                ...state,
                running: true,
                currentGame: newGameConfig,
                mainMenuVisible: false,
            }))
        },
        [gameState.players]
    )

    useEffect(() => {
        if (gameState.mainMenuVisible) {
            const logo = new Sprite(resources.logo.texture)
            const board1 = new Sprite(resources.sheet.textures['board.png'])
            const board2 = new Sprite(resources.sheet.textures['board.png'])

            logo.anchor.set(0.5)
            logo.position.x = dimensions.width / 2
            logo.position.y = dimensions.height / 2
            const scaleMultiplier = 6
            const scale = (dimensions.width / 6000) * scaleMultiplier
            const minScale = 0.27 * scaleMultiplier
            logo.scale.set(scale > minScale ? scale : minScale)

            const newGameText = new PIXI.Text('New Game', {
                fontFamily: 'Fira Code',
                fontSize: 24,
                fill: 0xffffff,
                align: 'center',
            })

            newGameText.anchor.set(0.5)
            newGameText.position.x = dimensions.width / 2
            const yPosition =
                scale > minScale
                    ? dimensions.height / 2 +
                      138.5 -
                      81 +
                      ((scale * 300) / scaleMultiplier) * 1.2
                    : 630
            newGameText.position.y = yPosition
            newGameText.interactive = true
            newGameText.cursor = 'pointer'
            newGameText.on('click', (event) => {
                newGame(event)
            })

            newGameText.on('mouseover', (event) => {
                newGameText.style = {
                    fontFamily: 'Fira Code',
                    fontSize: 24,
                    fill: 0xff0000,
                    align: 'center',
                }
            })

            newGameText.on('mouseout', (event) => {
                newGameText.style = {
                    fontFamily: 'Fira Code',
                    fontSize: 24,
                    fill: 0xffffff,
                    align: 'center',
                }
            })

            const playersText = new PIXI.Text(
                gameState.players.length === 0
                    ? 'No Players Connected'
                    : gameState.players.length + ' Players Connected',
                {
                    fontFamily: 'Fira Code',
                    fontSize: 24,
                    fill: gameState.players.length !== 0 ? 0x00ff00 : 0xff0000,
                    align: 'center',
                }
            )

            playersText.anchor.set(0.5)
            playersText.position.x = dimensions.width / 2

            playersText.position.y = newGameText.position.y + 30

            board1.anchor.set(0.5)
            board1.scale.set(4)
            board1.position.x = dimensions.width / 4
            board1.position.y = dimensions.height / 4
            board2.anchor.set(0.5)
            board2.scale.set(4)
            board2.position.x = (dimensions.width / 4) * 3
            board2.position.y = dimensions.height / 4

            let rotation = 0
            const animationCancelToken = setInterval(() => {
                rotation = rotation <= 360 ? rotation + 1 : 0
                const pulseScale = Math.sin(rotation * 0.1) * 0.05 + 1
                playersText.scale.set(pulseScale)
                board1.rotation = (Math.PI / 180) * rotation
                board2.rotation = (Math.PI / 180) * rotation
            }, 1000 / 15)

            stage.addChild(logo)
            stage.addChild(newGameText)
            stage.addChild(playersText)
            stage.addChild(board1)
            stage.addChild(board2)

            return () => {
                stage.removeChild(logo)
                stage.removeChild(newGameText)
                stage.removeChild(playersText)
                stage.removeChild(board1)
                stage.removeChild(board2)
                clearInterval(animationCancelToken)
            }
        }
    }, [dimensions, gameState.mainMenuVisible, engine, sprites.logo])

    useEffect(() => {
        if (
            gameState.running === false &&
            loadingProgress === 100 &&
            sprites.loaded &&
            loading === false
        ) {
            setGameState((state) => ({ ...state, mainMenuVisible: true }))
        }
    }, [gameState.running, loadingProgress, loading, sprites.loaded])

    useEffect(() => {
        setGameState((state) => ({ ...state }))
    }, [sprites.loaded])

    useEffect(() => {
        if (loading) {
            console.log('---PIXI LOADING PROGRESS', loadingProgress)
        }
        if (!loading && loadingProgress === 100) {
            setSprites((state) => ({
                ...state,
                loaded: true,
            }))
        }
    }, [loading, loadingProgress])

    useEffect(() => {
        if (loading) {
            loader.add('logo', 'images/KnavesOutLogo.png')
            loader.add('_logo', 'images/logo.png')
            loader.add('sheet', './images/spritesheet.json')
            loader.add('button', './images/button.png')

            loader.onProgress.add(({ progress }) =>
                setLoadingProgress(progress)
            )
            loader.load(({ progress }) => {
                console.log('---PIXI TEXTURES LOADED')
                setLoadingProgress(100)
                setLoading(false)
            })
        }
    }, [loading])

    useEffect(() => {
        if (engine) {
            // console.log('---RESIZING PIXI')
            engine.renderer.resize(dimensions.width, dimensions.height)
            stage.width = dimensions.width
            stage.height = dimensions.height
        }
    }, [engine, dimensions])

    useEffect(() => {
        const listener = window.addEventListener(
            'resize',
            ({ target: { innerHeight: height, innerWidth: width } }) => {
                setDimensions({ width, height })
            }
        )

        return () => window.removeEventListener(listener)
    }, [])

    useEffect(() => {
        const _engine = new Application({
            width: dimensions.width,
            height: dimensions.height,
            autoResize: true,
        })
        _engine.stage.filters = [
            new CRTFilter({
                curvature: 100,
                // lineContrast: 0.5,
                lineWidth: 10,
                noise: 0.5,
                time: 1000000,
            }),
        ]
        document.body.appendChild(_engine.view)
        const stage = new PIXI.Container()
        _engine.stage.addChild(stage)
        setStage(stage)
        setEngine(_engine)
    }, [])

    return null
}
customElements.define('knaves-out', component(App))
