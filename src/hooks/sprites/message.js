import { Graphics, NineSlicePlane, Text, Loader, Sprite } from 'pixi.js'
const loader = Loader.shared
const resources = loader.resources

export default ({ actor, message, active, dimensions }) => {
    const buttonContainer = new Graphics()

    buttonContainer.lineStyle(4, 0xffd900, 1)
    buttonContainer.drawRect(0, 0, 400, 33 * 4)

    buttonContainer.position.x = dimensions.width - 550
    buttonContainer.position.y = 100

    const button = new NineSlicePlane(resources.button.texture, 2, 2, 2, 2)
    button.width = 100
    button.height = 33
    button.scale.set(4)

    button.position.x = 0
    button.position.y = 0

    button.interactive = true
    button.buttonMode = true
    button.on('click', (event) => {
        buttonContainer.visible = false
    })

    const actorSprite = new Sprite(resources.sheet.textures[actor + '.png'])
    actorSprite.anchor.set(1, 0)
    actorSprite.position.x = buttonContainer.width - 12
    actorSprite.position.y = 12
    actorSprite.scale.set(4)

    const messageText = new Text(message.toUpperCase(), {
        fontFamily: 'Fira Code',
        fontSize: 20,
        fill: 0x000000,
        align: 'left',
    })
    messageText.anchor.set(0.0)
    messageText.position.x = 10
    messageText.position.y = 10

    buttonContainer.addChild(button)
    buttonContainer.addChild(messageText)
    buttonContainer.addChild(actorSprite)
    return buttonContainer
}
