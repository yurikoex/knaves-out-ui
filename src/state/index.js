import { useState } from 'haunted'

export default () => {
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
    return {
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
    }
}
