import { useEffect } from 'haunted'

export default (engine, dimensions) => {
    useEffect(() => {
        if (engine) {
            // console.log('---RESIZING PIXI')
            engine.renderer.resize(dimensions.width, dimensions.height)
            // stage.width = dimensions.width
            // stage.height = dimensions.height
        }
    }, [engine, dimensions])
}
