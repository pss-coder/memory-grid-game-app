import Square from "./Square";

// GameBoard component representing the grid of squares
const GameBoard = ({ level, gridSize, greenSquares, handleSquareClick }) => {
    const totalSquares = gridSize * gridSize;

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
      <div className={getDesignGridStyle(gridSize)} >
        {renderSquares()}
      </div>
    );
  };

export default GameBoard