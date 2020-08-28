import { component, useState, useEffect, State, useMemo } from 'haunted'
import * as PIXI from 'pixi.js'
import Peer from 'peerjs'
import css from './style.css'
import './images/logo.png'
import './images/button.png'
import spritesheetData from './images/spritesheet.json'
import './images/spritesheet.png'

console.log(spritesheetData)

const Application = PIXI.Application
const loader = PIXI.Loader.shared
const resources = loader.resources
const Sprite = PIXI.Sprite
const Spritesheet = PIXI.Spritesheet
const NineSlicePlane = PIXI.NineSlicePlane

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
        { type: 'knave', card: null, joker: null, tower: [] },
        { type: 'queen', card: null, joker: null, tower: [] },
        { type: 'king', card: null, joker: null, tower: [] },
        { type: 'aos', card: null, joker: null, tower: [] },
    ],
    placedLand: null,
    order: Math.floor(Math.random() * 1000000000),
    turns: 0,
})

const App = () => {
    const [engine, setEngine] = useState(null)
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

                const turnTextText = `End Turn`.toUpperCase()
                const turnText = new PIXI.Text(turnTextText, {
                    fontFamily: 'Arial',
                    fontSize: 6,
                    fill: 0xffffff,
                    align: 'center',
                })
                turnText.anchor.set(0.0)

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
                    fontFamily: 'Arial',
                    fontSize: 24,
                    fill: 0xffffff,
                    align: 'left',
                })
                debugStats.anchor.set(0)
                debugStats.position.x = 0
                debugStats.position.y = 0

                let rotation = 0
                const animationCancelToken = setInterval(() => {
                    rotation = rotation <= 360 ? rotation + 1 : 0
                    const pulseScale = Math.sin(rotation * 0.1) * 0.05 + 1
                    turnText.scale.set(pulseScale)
                }, 1000 / 15)

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

                button.position.x = dimensions.width / 2
                button.position.y = dimensions.height / 2
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

                button.addChild(turnText)

                engine.stage.addChild(button)
                engine.stage.addChild(debugStats)

                return () => {
                    engine.stage.removeChild(button)
                    engine.stage.removeChild(debugStats)
                    clearInterval(animationCancelToken)
                }
            }
        }
    }, [gameState.running, gameState.currentGame.turns])

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
            const scale = dimensions.width / 5000
            const minScale = 0.27
            logo.scale.set(scale > minScale ? scale : minScale)

            const newGameText = new PIXI.Text('New Game', {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 0xffffff,
                align: 'center',
            })

            newGameText.anchor.set(0.5)
            newGameText.position.x = dimensions.width / 2
            const yPosition =
                scale > minScale
                    ? dimensions.height / 2 + 138.5 - 81 + scale * 300
                    : 600
            newGameText.position.y = yPosition
            newGameText.interactive = true
            newGameText.cursor = 'pointer'
            newGameText.on('click', (event) => {
                newGame(event)
            })

            newGameText.on('mouseover', (event) => {
                newGameText.style = {
                    fontFamily: 'Arial',
                    fontSize: 24,
                    fill: 0xff0000,
                    align: 'center',
                }
            })

            newGameText.on('mouseout', (event) => {
                newGameText.style = {
                    fontFamily: 'Arial',
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
            const playersTextyPosition =
                scale > minScale
                    ? dimensions.height / 2 + 138.5 + 50 - 81 + scale * 300
                    : 600 + 50
            playersText.position.y = playersTextyPosition

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

            engine.stage.addChild(logo)
            engine.stage.addChild(newGameText)
            engine.stage.addChild(playersText)
            engine.stage.addChild(board1)
            engine.stage.addChild(board2)

            return () => {
                engine.stage.removeChild(logo)
                engine.stage.removeChild(newGameText)
                engine.stage.removeChild(playersText)
                engine.stage.removeChild(board1)
                engine.stage.removeChild(board2)
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
            loader.add('logo', 'images/logo.png')
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
        document.body.appendChild(_engine.view)
        setEngine(_engine)
    }, [])

    return null
}
customElements.define('knaves-out', component(App))
