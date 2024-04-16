import { useState } from "react";
import Square from "./Square";

// GameBoard component representing the grid of squares
const GameBoard = ({ level, gridSize, clickedSquares ,greenSquares, disableClick ,handleSquareClick, showAnswer }) => {
    const totalSquares = gridSize * gridSize;

    // CSS Design Grid
    function getDesignGridStyle(gridSize) {
        switch (gridSize) {
            case 3:
                return `grid grid-cols-3 gap-4`
            case 4:
                return `grid grid-cols-4 gap-4`
            case 5:
                return `grid grid-cols-5 gap-4`
            case 6:
                return `grid grid-cols-6 gap-4`
            case 7:
                return `grid grid-cols-7 gap-4`
            default:
                return `grid grid-cols-3 gap-4`
        }
    }
  
    // Generate grid of squares
    const renderSquares = () => {
        // Also pick random of [greenSquares] for user to memorise
      let squares = [];
      for (let i = 0; i < totalSquares; i++) {

        squares.push(
          <Square
            disableClick = {disableClick}
            key={i}
            id={i}
            isGreen={greenSquares.includes(i)} // how to mark markedSquareIndex, if element in markedSquareIndex array has same value?
            handleClick={handleSquareClick}
            isClicked={clickedSquares.includes(i)} // Pass down whether the square is clicked
            showAnswer = {showAnswer}
          />
        );
      }
      return squares;
    };
  
    return (
      <div className={getDesignGridStyle(gridSize)} >
        {renderSquares()}
      </div>
    );
  };

export default GameBoard