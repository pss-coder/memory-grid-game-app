import { playSound } from '../utils';

// Square component representing each square in the grid
const Square = ({ id, isGreen, handleClick, disableClick, isClicked, showAnswer }) => {
    
    return (
      <div>
        <button
        disabled={disableClick}
        className={`rounded shadow-md w-20 h-20 border border-gray-400 cursor-pointer hover:shadow-2xl
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