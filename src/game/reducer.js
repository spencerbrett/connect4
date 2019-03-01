import { getAvailableMoves, getScore, isGameOver, makeMove, RED } from "./rules";
import { createAI } from "./ai";

export function initialState() {
    return { cells: Array(42).fill(null), playerTurn: RED }
}

export function reducer(state, action) {
    switch (action.type) {
        case 'move':
            return makeMove(state, action.payload);
        case 'computer':
            return handleComputer(state);
        case 'reset':
            return initialState();
        default:
            throw new Error();
    }
}

function handleComputer(state) {
    const computerPlayer = createAI({ isGameOver, getScore, makeMove, getAvailableMoves });
    const computerMove = computerPlayer.getMove(state);
    return computerMove ? makeMove(state, computerMove) : state;
}