import { useEffect } from 'haunted'

export default (gameState, setGameState) => {
    useEffect(() => {
        if (gameState.running && gameState.currentGame.turns.length === 0) {
            setGameState((state) => ({
                ...state,
                currentGame: {
                    ...state.currentGame,
                    turns: [
                        {
                            index: 0,
                            complete: false,
                            num: 1,
                            round: 1,
                        },
                    ],
                },
            }))
        } else if (
            gameState.running &&
            gameState.currentGame.turns[gameState.currentGame.turns.length - 1]
                .complete
        ) {
            const lastTurnIndex =
                gameState.currentGame.turns[
                    gameState.currentGame.turns.length - 1
                ].index
            const lastTurnNum =
                gameState.currentGame.turns[
                    gameState.currentGame.turns.length - 1
                ].num
            const lastRound =
                gameState.currentGame.turns[
                    gameState.currentGame.turns.length - 1
                ].round
            const numPlayersZeroBased = gameState.currentGame.players.length - 1
            setGameState((state) => ({
                ...state,
                currentGame: {
                    ...state.currentGame,
                    players: state.currentGame.players.map((player, i) =>
                        i === lastTurnIndex
                            ? {
                                  ...player,
                                  turns: player.turns + 1,
                              }
                            : { ...player }
                    ),
                    turns: [
                        ...gameState.currentGame.turns,
                        {
                            index:
                                lastTurnIndex === numPlayersZeroBased
                                    ? 0
                                    : lastTurnIndex + 1,
                            complete: false,
                            num: lastTurnNum + 1,
                            round:
                                lastTurnIndex === numPlayersZeroBased
                                    ? lastRound + 1
                                    : lastRound,
                        },
                    ],
                },
            }))
        }
    }, [gameState.running, gameState.currentGame.turns])
}
