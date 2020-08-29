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
