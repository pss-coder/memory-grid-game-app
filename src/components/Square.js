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
        className={`w-20 h-20 border border-gray-300 cursor-pointer
        ${isGreen ? ' bg-green-500' : ''} 
        ${isClicked ? ' bg-green-500' : ''} 
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