export default () => {

    const RED = 'red';
    const YELLOW = 'yellow';

    const WIDTH = 7;
    const HEIGHT = 6;


    function makeMove(state, move) {
        const { player, columnIndex } = move;
        const cells = state.cells.slice();
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

    function getAvailableMoves(state) {
        const { cells, playerTurn } = state;
        return range(WIDTH).reduce((acc, c) => {
            if (!cells[indexOf(0, c)]) {
                return acc.concat({ player: playerTurn, columnIndex: c });
            }
            return acc;
        }, []);
    }

    function checkWinner(state) {
        return checkHorizontal(state) || checkVertical(state) || checkDiagonalLeft(state) || checkDiagonalRight(state);
    }

    function isGameOver(state) {
        return checkWinner(state) || getAvailableMoves(state).length === 0;
    }

    function getScore(state) {
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
        const { cells } = state;
        return cells.filter(c => !c).length;
    }

    function alphaBeta({ state, depth, alpha, beta, maximizingPlayer }) {
        if (depth === 0 || isGameOver(state)) {
            return getScore(state);
        }
        if (maximizingPlayer) {
            let value = Number.NEGATIVE_INFINITY;
            for (const move of getAvailableMoves(state)) {
                const nextState = makeMove(state, move);
                value = Math.max(value, alphaBeta({ state: nextState, depth: depth - 1, alpha, beta, maximizingPlayer: false }));
                alpha = Math.max(alpha, value);
                if (alpha >= beta) {
                    break; // beta cut-off
                }
            }
            return value;
        } else {
            let value = Number.POSITIVE_INFINITY;
            for (const move of getAvailableMoves(state)) {
                const nextState = makeMove(state, move);
                value = Math.min(value, alphaBeta({ state: nextState, depth: depth - 1, alpha, beta, maximizingPlayer: true }));
                beta = Math.min(beta, value);
                if (alpha >= beta) {
                    break; // alpha cut-off
                }
            }
            return value;
        }
    }

    function getMove(state, maxDepth) {
        let bestScore = Number.NEGATIVE_INFINITY;
        const moveMap = getAvailableMoves(state).reduce((map, move) => {
            const score = alphaBeta({ state: makeMove(state, move), depth: maxDepth, alpha: Number.NEGATIVE_INFINITY, beta: Number.POSITIVE_INFINITY, maximizingPlayer: false });
            if (score > bestScore) {
                bestScore = score;
            }
            if (map.has(score)) {
                map.set(score, map.get(score).concat(move));
            } else {
                map.set(score, [move]);
            }
            return map;
        }, new Map());
        return moveMap.size > 0 ? chooseRandom(moveMap.get(bestScore)) : null;
    }

    function chooseRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function indexOf(r, c) {
        return r * WIDTH + c;
    }

    function range(n) {
        return Array.from(new Array(n), (_, i) => i);
    }

    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if (!e) {
            return;
        }
        const gameState = e.data;
        const computerMove = getMove(gameState, 8);

        postMessage(computerMove);
    })
}