import { Text } from 'pixi.js'

export default (currentTurn, currentPlayer, dimensions) => {
    const debugText = `Total Turns ${currentTurn.num}
Round: ${currentTurn.round}
ID: ${currentPlayer.id}
Name: ${currentPlayer.name}
Players Turn: ${currentPlayer.turns + 1}
Placed Land: ${currentPlayer.placedLand}
Deck: ${currentPlayer.deck.length}
Discard: ${currentPlayer.discard.length}
Court In Play: ${currentPlayer.court.reduce((t, c) => (c.card ? t + 1 : t), 0)}
Knave: ${currentPlayer.court.find((c) => c.type === 'knave').card}
Queen: ${currentPlayer.court.find((c) => c.type === 'queen').card}
King: ${currentPlayer.court.find((c) => c.type === 'king').card}
AOS: ${currentPlayer.court.find((c) => c.type === 'aos').card}
Zoom: ${currentPlayer.worldZoomLevel}
OffsetX: ${currentPlayer.worldOffsetX}
OffsetY: ${currentPlayer.worldOffsetY}
Dragging: ${currentPlayer.dragging.active}
DraggingX: ${currentPlayer.dragging.x}
DraggingY: ${currentPlayer.dragging.y}
                `.toUpperCase()
    const debugStats = new Text(debugText, {
        fontFamily: 'Fira Code',
        fontSize: 24,
        fill: 0xffffff,
        align: 'left',
    })
    debugStats.anchor.set(0)
    debugStats.position.x = 10
    debugStats.position.y = 10
    const statsScale = dimensions.width / dimensions.height - 0.5
    // console.log(statsScale)
    debugStats.scale.set(
        statsScale > 1 ? 1 : statsScale < 0.5 ? 0.5 : statsScale
    )
    return debugStats
}
