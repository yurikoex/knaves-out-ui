import { component, useState, useEffect, State, useMemo } from 'haunted'
import * as PIXI from 'pixi.js'
import Peer from 'peerjs'
import css from './style.css'
import './images/logo.png'

const Application = PIXI.Application
const loader = PIXI.Loader.shared
const resources = loader.resources
const Sprite = PIXI.Sprite

PIXI.utils.TextureCache['images/logo.png']

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
    court: [],
    placedLand: null,
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
        currentGame: null,
        connectedPlayers: [],
        players: [
            {
                id: 1,
                name: 'bob',
            },
            {
                id: 2,
                name: 'alice',
            },
            {
                id: 3,
                name: 'karen',
            },
            {
                id: 4,
                name: 'kyle',
            },
        ],
        mainMenuVisible: false,
    })

    const newGame = useMemo(
        () => (event) => {
            const newGameConfig = {
                players: gameState.players.map((player) =>
                    generateNewGamePlayer(player)
                ),
            }
        },
        [gameState.players]
    )

    useEffect(() => {
        if (gameState.mainMenuVisible) {
            console.log('SHOW MENU')
            sprites.logo.anchor.set(0.5)
            sprites.logo.position.x = dimensions.width / 2
            sprites.logo.position.y = dimensions.height / 2
            const scale = dimensions.width / 5000
            const minScale = 0.27
            sprites.logo.scale.set(scale > minScale ? scale : minScale)
            engine.stage.addChild(sprites.logo)

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
            engine.stage.addChild(newGameText)

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

            engine.stage.addChild(playersText)

            let pulseNum = 0
            const cancel = setInterval(() => {
                const pulseScale = Math.sin(++pulseNum * 0.1) * 0.05 + 1
                playersText.scale.set(pulseScale)
            }, 1000 / 15)

            return () => {
                engine.stage.removeChild(sprites.logo)
                engine.stage.removeChild(newGameText)
                engine.stage.removeChild(playersText)
                clearInterval(cancel)
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
            const logo = new Sprite(resources.logo.texture)
            setSprites((state) => ({ ...state, loaded: true, logo }))
        }
    }, [loading, loadingProgress])

    useEffect(() => {
        if (loading) {
            loader.add('logo', 'images/logo.png')
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
            console.log('---RESIZING PIXI')
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
