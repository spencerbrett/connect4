import React, { useEffect, useReducer, useState } from 'react';
import { initialState, reducer } from "./game/reducer";
import { checkWinner, getAvailableMoves, isValidMove, RED, YELLOW } from "./game/rules";
import Grid from "./grid/Grid";
import './Game.css';

const Game = () => {
    const [gameState, dispatch] = useReducer(reducer, initialState());
    const [message, setMessage] = useState('');
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
        if (gameState.playerTurn === YELLOW) {
            dispatch({ type: 'computer' });
        }
    }, [gameState.playerTurn]);


    const handleCellClick = (columnIndex) => () => {
        if (!isValidMove(gameState, columnIndex) || gameState.playerTurn !== RED) {
            return null;
        }
        dispatch({ type: 'move', payload: { player: RED, columnIndex } });
    };

    const handleNewGameClick = () => {
        setMessage('');
        dispatch({ type: 'reset' });
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