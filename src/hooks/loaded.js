import { useEffect } from 'haunted'

export default (loading, loadingProgress, setSprites) => {
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
}
