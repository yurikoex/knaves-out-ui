import Peer from 'peerjs'
import './style.css'

import { Application, settings, SCALE_MODES } from 'pixi.js'
import { CRTFilter } from '@pixi/filter-crt'

settings.SCALE_MODE = SCALE_MODES.NEAREST

import { init } from './hooks/init'

const game = async () => {
    const engine = new Application({
        width: window.innerWidth,
        height: window.innerHeight,
        autoResize: true,
    })
    engine.stage.filters = [
        new CRTFilter({
            curvature: 100,
            vignetting: 0.1,
            lineWidth: 10,
            noise: 0.5,
            time: 1000000,
        }),
    ]
    document.body.appendChild(engine.view)

    window.addEventListener(
        'resize',
        ({ target: { innerHeight: height, innerWidth: width } }) => {
            engine.renderer.resize(width, height)
        }
    )

    console.log(engine)

    const render = async () => {
        window.requestAnimationFrame(render)
    }
    render()
}
game()
