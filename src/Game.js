import React, { useEffect, useState } from 'react';
import { checkWinner, getAvailableMoves, isGameOver, isValidMove, makeMove, RED, YELLOW } from "./game/rules";
import Grid from "./grid/Grid";
import './Game.css';
import useWorker from "./hooks/useWorker";
import aiWorker from "./game/aiWorker";

const initialGameState = () => {
    return { cells: Array(42).fill(null), playerTurn: RED }
};

const Game = () => {
    const [gameState, setGameState] = useState(initialGameState());
    const [message, setMessage] = useState('');
    const worker = useWorker(aiWorker, e => {
        const computerMove = e.data;
        setGameState(makeMove(gameState, computerMove));
    });
    // update message
    useEffect(() => {
        const winner = checkWinner(gameState);
        const draw = !winner && getAvailableMoves(gameState).length === 0;
        if (winner === RED) {
            setMessage('Player 1 (red) wins!');
        } else if (winner === YELLOW) {
            setMessage('Player 2 (yellow) wins!');
        } else if (draw) {
            setMessage('Draw game.');
        }
    }, [gameState]);
    // computer turn
    useEffect(() => {
        if (gameState.playerTurn === YELLOW && !isGameOver(gameState)) {
            worker.postMessage(gameState);
        }
    }, [gameState.playerTurn]);


    const handleCellClick = (columnIndex) => () => {
        if (!isValidMove(gameState, columnIndex) || gameState.playerTurn !== RED) {
            return null;
        }
        setGameState(makeMove(gameState, { player: RED, columnIndex }));
    };

    const handleNewGameClick = () => {
        setMessage('');
        setGameState(initialGameState());
    };

    return (
        <div>
            <button className="button" onClick={handleNewGameClick}>New Game</button>
            <Grid gameState={gameState} onCellClick={handleCellClick}/>
            <p className="message">{message}</p>
        </div>
    );
};
export default Game;