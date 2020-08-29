import { useEffect } from 'haunted'
import { Loader } from 'pixi.js'
const loader = Loader.shared

import '../images/KnavesOutLogo.png'
import '../images/KnaveHearts.png'
import '../images/logo.png'
import '../images/button.png'
import '../images/spritesheet.png'

export default (loading, setLoadingProgress, setLoading) => {
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
}
