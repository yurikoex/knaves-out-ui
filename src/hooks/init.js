import { useEffect } from 'haunted'
import { Application } from 'pixi.js'
import { CRTFilter } from '@pixi/filter-crt'

export default (setEngine, dimensions) => {
    useEffect(() => {
        const _engine = new Application({
            width: dimensions.width,
            height: dimensions.height,
            autoResize: true,
        })
        _engine.stage.filters = [
            new CRTFilter({
                curvature: 100,
                vignetting: 0.1,
                lineWidth: 10,
                noise: 0.5,
                time: 1000000,
            }),
        ]
        document.body.appendChild(_engine.view)
        setEngine(_engine)
    }, [])
}
