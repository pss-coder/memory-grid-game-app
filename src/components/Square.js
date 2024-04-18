import { playSound } from '../utils';

// Square component representing each square in the grid
const Square = ({ id, isGreen, handleClick, disableClick, isClicked, showAnswer, gridSize }) => {
  
  function updateWidthHeightBy(gridSize) {
    switch (gridSize) {
        case 3:
            return `w-20 h-20`
        case 4:
            return `w-16 h-16 md:w-16 md:h-16 lg:w-16 lg:h-16`
        case 5:
            return `w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16`
        case 6:
            return `w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14`
        case 7:
            return `w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12`
        default:
            return `w-20 h-20`
    }
  }
    
  return (
      <div>
        <button
        disabled={disableClick}
        className={`rounded shadow-md ${updateWidthHeightBy(gridSize)} border border-gray-400 cursor-pointer hover:shadow-2xl
        ${ (isGreen && !showAnswer) ? ' bg-green-300' : ''} 
        ${isClicked ? ' bg-green-300' : ''} 
        ${ (isGreen && showAnswer) ? 'bg-red-300' : ''}
        `  
        }
        onClick={() => {
          playSound('click')
          handleClick(id)
        }
        
        }
      ></button>
      </div>
    );
  };

export default Square