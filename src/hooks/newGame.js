import { useMemo } from 'haunted'

const getNewDeck = () => {
    let deck = [
        {
            suit: 'hearts',
            value: 2,
        },
        {
            suit: 'hearts',
            value: 3,
        },
        {
            suit: 'hearts',
            value: 4,
        },
        {
            suit: 'hearts',
            value: 5,
        },
        {
            suit: 'hearts',
            value: 6,
        },
        {
            suit: 'hearts',
            value: 7,
        },
        {
            suit: 'hearts',
            value: 8,
        },
        {
            suit: 'hearts',
            value: 9,
        },
        {
            suit: 'hearts',
            value: 10,
        },
        {
            suit: 'hearts',
            value: 'J',
        },
        {
            suit: 'hearts',
            value: 'Q',
        },
        {
            suit: 'hearts',
            value: 'K',
        },
        {
            suit: 'hearts',
            value: 'A',
        },
        {
            suit: 'diamonds',
            value: 2,
        },
        {
            suit: 'diamonds',
            value: 3,
        },
        {
            suit: 'diamonds',
            value: 4,
        },
        {
            suit: 'diamonds',
            value: 5,
        },
        {
            suit: 'diamonds',
            value: 6,
        },
        {
            suit: 'diamonds',
            value: 7,
        },
        {
            suit: 'diamonds',
            value: 8,
        },
        {
            suit: 'diamonds',
            value: 9,
        },
        {
            suit: 'diamonds',
            value: 10,
        },
        {
            suit: 'diamonds',
            value: 'J',
        },
        {
            suit: 'diamonds',
            value: 'Q',
        },
        {
            suit: 'diamonds',
            value: 'K',
        },
        {
            suit: 'diamonds',
            value: 'A',
        },
        {
            suit: 'clubs',
            value: 2,
        },
        {
            suit: 'clubs',
            value: 3,
        },
        {
            suit: 'clubs',
            value: 4,
        },
        {
            suit: 'clubs',
            value: 5,
        },
        {
            suit: 'clubs',
            value: 6,
        },
        {
            suit: 'clubs',
            value: 7,
        },
        {
            suit: 'clubs',
            value: 8,
        },
        {
            suit: 'clubs',
            value: 9,
        },
        {
            suit: 'clubs',
            value: 10,
        },
        {
            suit: 'clubs',
            value: 'J',
        },
        {
            suit: 'clubs',
            value: 'Q',
        },
        {
            suit: 'clubs',
            value: 'K',
        },
        {
            suit: 'clubs',
            value: 'A',
        },
        {
            suit: 'spades',
            value: 2,
        },
        {
            suit: 'spades',
            value: 3,
        },
        {
            suit: 'spades',
            value: 4,
        },
        {
            suit: 'spades',
            value: 5,
        },
        {
            suit: 'spades',
            value: 6,
        },
        {
            suit: 'spades',
            value: 7,
        },
        {
            suit: 'spades',
            value: 8,
        },
        {
            suit: 'spades',
            value: 9,
        },
        {
            suit: 'spades',
            value: 10,
        },
        {
            suit: 'spades',
            value: 'J',
        },
        {
            suit: 'spades',
            value: 'Q',
        },
        {
            suit: 'spades',
            value: 'K',
        },
        {
            suit: 'spades',
            value: 'A',
        },
        {
            suit: 'Joker',
            value: 'Joker',
        },
        {
            suit: 'Joker',
            value: 'Joker',
        },
    ]
    const shuffled = []
    while (deck.length !== 0) {
        const [randomCard] = deck.splice(
            Math.floor(Math.random() * deck.length),
            1
        )
        shuffled.push(randomCard)
    }
    return shuffled
}

const generateNewGamePlayer = ({ id, name }) => ({
    id,
    name,
    deck: getNewDeck(),
    discard: [],
    court: [
        { type: 'knave', card: null, joker: null, devoured: [], tower: [] },
        { type: 'queen', card: null, joker: null, devoured: [], tower: [] },
        { type: 'king', card: null, joker: null, devoured: [], tower: [] },
        { type: 'aos', card: null, joker: null, devoured: [], tower: [] },
    ],
    placedLand: null,
    order: Math.floor(Math.random() * 1000000000),
    turns: 0,
    worldZoomLevel: 100,
    dragging: { active: false, x: 0, y: 0 },
    worldOffsetX: 0,
    worldOffsetY: 0,
    worldPosition: { gridX: 0, gridY: 0 },
})

export default (gameState, setGameState) =>
    useMemo(
        () => (event) => {
            const orderedPlayers = gameState.players
                .map((player) => generateNewGamePlayer(player))
                .sort((a, b) => (a.order > b.order ? -1 : 1))
            const newGameConfig = {
                players: orderedPlayers,
                turns: [],
                worldSize: orderedPlayers.length * 10,
            }
            setGameState((state) => ({
                ...state,
                running: true,
                currentGame: newGameConfig,
                mainMenuVisible: false,
            }))
        },
        [gameState.players]
    )
