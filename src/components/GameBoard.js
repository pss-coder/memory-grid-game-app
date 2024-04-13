import Square from "./Sqaure";

// GameBoard component representing the grid of squares
const GameBoard = ({ level, gridSize, greenSquares, handleSquareClick }) => {
    const totalSquares = gridSize * gridSize;
  
    // Generate grid of squares
    const renderSquares = () => {
      let squares = [];
      for (let i = 0; i < totalSquares; i++) {
        squares.push(
          <Square
            key={i}
            id={i}
            isGreen={false} // TODO
            handleClick={handleSquareClick}
          />
        );
      }
      return squares;
    };
  
    return (
      <div className={`grid grid-cols-${gridSize} gap-4`}>
        {renderSquares()}
      </div>
    );
  };

export default GameBoard