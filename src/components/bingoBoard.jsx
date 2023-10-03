import React from 'react'
import './BingoBoard.css';

const BingoBoard = ({boardData}) => {
    return (
        <div className="bingo-board">
          {boardData.map((row, rowIndex) => (
            <div key={rowIndex} className="bingo-row">
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`bingo-cell ${cell.marked ? 'marked' : ''}`}
                >
                  {cell.value}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
}

export default BingoBoard