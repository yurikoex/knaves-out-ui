export default ({
    currentPlayer,
    currentPlayerWorldZoomLevel,
    setGameState,
}) => {
    const mouseWheelListener = ({ deltaY }) => {
        const newZoom = currentPlayerWorldZoomLevel + deltaY * 0.1

        // console.log(newZoom, currentPlayerWorldZoomLevel, deltaY)
        setGameState((state) => ({
            ...state,
            currentGame: {
                ...state.currentGame,
                players: state.currentGame.players.map((player) =>
                    player.id === currentPlayer.id
                        ? {
                              ...player,
                              worldZoomLevel: newZoom,
                          }
                        : { ...player }
                ),
            },
        }))
    }

    return (events) => mouseWheelListener(events)
}
