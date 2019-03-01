export function createAI({ isGameOver, getScore, getAvailableMoves, makeMove, maxDepth = 6 }) {

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

    const getMove = (state) => {
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
    };

    return { getMove };
}

function chooseRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}