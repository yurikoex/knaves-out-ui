import { useEffect } from 'haunted'

export default (gameState, loadingProgress, loading, sprites, setGameState) => {
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
}
