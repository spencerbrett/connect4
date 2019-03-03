import { indexOf, range } from "./utils";

export const RED = 'red';
export const YELLOW = 'yellow';

export const WIDTH = 7;
export const HEIGHT = 6;

export function makeMove(state, move) {
    const { player, columnIndex } = move;
    const cells = [...state.cells];
    let r = HEIGHT - 1;
    for (; r >= 0; r--) {
        if (!cells[indexOf(r, columnIndex)]) {
            break;
        }
    }
    cells[indexOf(r, columnIndex)] = player;
    const playerTurn = player !== RED ? RED : YELLOW;
    return { cells, playerTurn };
}

export function getAvailableMoves(state) {
    const { cells, playerTurn } = state;
    return range(WIDTH).reduce((acc, c) => {
        if (!cells[indexOf(0, c)]) {
            return acc.concat({ player: playerTurn, columnIndex: c });
        }
        return acc;
    }, []);
}

export function checkWinner(state) {
    return checkHorizontal(state) || checkVertical(state) || checkDiagonalLeft(state) || checkDiagonalRight(state);
}

export function isGameOver(state) {
    return checkWinner(state) || getAvailableMoves(state).length === 0;
}

export function getScore(state) {
    const winner = checkWinner(state);
    let score = 0;
    // X is the human player. We attribute a negative score to the human player.
    if (winner === RED) {
        score = -(1 + countEmptyCells(state));
    } else if (winner === YELLOW) {
        score = 1 + countEmptyCells(state);
    }
    return score;
}

export function isValidMove(state, columnIndex) {
    const { cells } = state;
    return !(cells[indexOf(0, columnIndex)] || isGameOver(state));
}

function checkHorizontal(state) {
    const { cells } = state;
    for (let r = 0; r < HEIGHT; r++) {
        for (let c = 0; c < WIDTH - 3; c++) {
            const cell = cells[indexOf(r, c)];
            if (cell
                && cell === cells[indexOf(r, c + 1)]
                && cell === cells[indexOf(r, c + 2)]
                && cell === cells[indexOf(r, c + 3)]) {
                return cell;
            }
        }
    }
}

function checkVertical(state) {
    const { cells } = state;
    for (let r = 0; r < HEIGHT - 3; r++) {
        for (let c = 0; c < WIDTH; c++) {
            const cell = cells[indexOf(r, c)];
            if (cell
                && cell === cells[indexOf(r + 1, c)]
                && cell === cells[indexOf(r + 2, c)]
                && cell === cells[indexOf(r + 3, c)]) {
                return cell;
            }
        }
    }
}

function checkDiagonalLeft(state) {
    const { cells } = state;
    for (let r = 3; r < HEIGHT; r++) {
        for (let c = 3; c < WIDTH; c++) {
            const cell = cells[indexOf(r, c)];
            if (cell
                && cell === cells[indexOf(r - 1, c - 1)]
                && cell === cells[indexOf(r - 2, c - 2)]
                && cell === cells[indexOf(r - 3, c - 3)]) {
                return cell;
            }
        }
    }
}

function checkDiagonalRight(state) {
    const { cells } = state;
    for (let r = 3; r < HEIGHT; r++) {
        for (let c = 0; c < WIDTH - 3; c++) {
            const cell = cells[indexOf(r, c)];
            if (cell
                && cell === cells[indexOf(r - 1, c + 1)]
                && cell === cells[indexOf(r - 2, c + 2)]
                && cell === cells[indexOf(r - 3, c + 3)]) {
                return cell;
            }
        }
    }
}

function countEmptyCells(state) {
    const {cells} = state;
    return cells.filter(c => !c).length;
}