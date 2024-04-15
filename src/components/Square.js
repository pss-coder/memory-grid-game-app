import { useEffect, useState } from 'react';
import click from '../assets/click.wav'

// Square component representing each square in the grid
const Square = ({ id, isGreen, handleClick, disableClick, isClicked }) => {
    
  // every click play sound
  function playSound() { 
    const audio = new Audio(click)
    audio.volume = 0.1
    audio.play()
  }
    return (
      <div>
        <button
        disabled={disableClick}
        className={`rounded shadow-md w-20 h-20 border border-gray-400 cursor-pointer hover:shadow-2xl
        ${isGreen ? ' bg-green-300' : ''} 
        ${isClicked ? ' bg-green-300' : ''} 
        `  
        }
        onClick={() => {
          handleClick(id)
          playSound()
        }
        
        }
      ></button>
      </div>
    );
  };

export default Square