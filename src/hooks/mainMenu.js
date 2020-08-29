import { useEffect } from 'haunted'
import { Sprite, Text, Loader } from 'pixi.js'
const loader = Loader.shared
const resources = loader.resources

export default (dimensions, gameState, engine, sprites, newGame) => {
    useEffect(() => {
        if (gameState.mainMenuVisible) {
            const logo = new Sprite(resources.logo.texture)
            const board1 = new Sprite(resources.sheet.textures['board.png'])
            const board2 = new Sprite(resources.sheet.textures['board.png'])

            logo.anchor.set(0.5)
            logo.position.x = dimensions.width / 2
            logo.position.y = dimensions.height / 2
            const scaleMultiplier = 6
            const scale = (dimensions.width / 6000) * scaleMultiplier
            const minScale = 0.27 * scaleMultiplier
            logo.scale.set(scale > minScale ? scale : minScale)

            const newGameText = new Text('New Game', {
                fontFamily: 'Fira Code',
                fontSize: 24,
                fill: 0xffffff,
                align: 'center',
            })

            newGameText.anchor.set(0.5)
            newGameText.position.x = dimensions.width / 2
            const yPosition =
                scale > minScale
                    ? dimensions.height / 2 +
                      138.5 -
                      81 +
                      ((scale * 300) / scaleMultiplier) * 1.2
                    : 630
            newGameText.position.y = yPosition
            newGameText.interactive = true
            newGameText.cursor = 'pointer'
            newGameText.on('click', (event) => {
                newGame(event)
            })

            newGameText.on('mouseover', (event) => {
                newGameText.style = {
                    fontFamily: 'Fira Code',
                    fontSize: 24,
                    fill: 0xff0000,
                    align: 'center',
                }
            })

            newGameText.on('mouseout', (event) => {
                newGameText.style = {
                    fontFamily: 'Fira Code',
                    fontSize: 24,
                    fill: 0xffffff,
                    align: 'center',
                }
            })

            const playersText = new Text(
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

            playersText.position.y = newGameText.position.y + 30

            board1.anchor.set(0.5)
            board1.scale.set(4)
            board1.position.x = dimensions.width / 4
            board1.position.y = dimensions.height / 4
            board2.anchor.set(0.5)
            board2.scale.set(4)
            board2.position.x = (dimensions.width / 4) * 3
            board2.position.y = dimensions.height / 4

            let rotation = 0
            const animationCancelToken = setInterval(() => {
                rotation = rotation <= 360 ? rotation + 1 : 0
                const pulseScale = Math.sin(rotation * 0.1) * 0.05 + 1
                playersText.scale.set(pulseScale)
                board1.rotation = (Math.PI / 180) * rotation
                board2.rotation = (Math.PI / 180) * rotation
            }, 1000 / 15)

            engine.stage.addChild(logo)
            engine.stage.addChild(newGameText)
            engine.stage.addChild(playersText)
            engine.stage.addChild(board1)
            engine.stage.addChild(board2)

            return () => {
                engine.stage.removeChild(logo)
                engine.stage.removeChild(newGameText)
                engine.stage.removeChild(playersText)
                engine.stage.removeChild(board1)
                engine.stage.removeChild(board2)
                clearInterval(animationCancelToken)
            }
        }
    }, [dimensions, gameState.mainMenuVisible, engine, sprites.logo])
}
