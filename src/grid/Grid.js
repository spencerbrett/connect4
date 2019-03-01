import React from 'react';
import './Grid.css';
import { indexOf, range } from "../game/utils";
import { HEIGHT, WIDTH } from "../game/rules";
import Cell from "./Cell";
import Row from "./Row";

const Grid = ({ gameState, onCellClick }) => {
    const rows = range(HEIGHT).map(r => {
        const cells = range(WIDTH).map(c => {
            const buttonClass = ['circle', 'clickable', gameState.cells[indexOf(r, c)] || 'white'].join(' ');
            return (
                <Cell key={'col-' + c}>
                    <div className="box" onClick={onCellClick(c)}>
                        <button className={buttonClass}/>
                    </div>
                </Cell>
            )
                ;
        });
        return (
            <Row key={'row-' + r}>
                {cells}
            </Row>
        )
    });

    return (
        <div className="table">
            {rows}
        </div>
    )
};

export default Grid;