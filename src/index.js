import { component } from 'haunted'
import Peer from 'peerjs'
import './style.css'

import useKnavesOutState from './state'

import useInit from './hooks/init'
import useResize from './hooks/resize'
import useResponsive from './hooks/responsive'
import useLoader from './hooks/loader'
import useLoaded from './hooks/loaded'
import useGameStartup from './hooks/gameStartup'
import useMainMenu from './hooks/mainMenu'
import useNewGame from './hooks/newGame'
import useTurns from './hooks/turns'
import useMainLogic from './hooks/mainLogic'

const App = () => {
    const {
        engine,
        setEngine,
        dimensions,
        setDimensions,
        loading,
        setLoading,
        loadingProgress,
        setLoadingProgress,
        sprites,
        setSprites,
        gameState,
        setGameState,
    } = useKnavesOutState()

    useMainLogic(gameState, dimensions, engine, setGameState)
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
