import click from '../assets/click.wav'

// Square component representing each square in the grid
const Square = ({ id, isGreen, handleClick }) => {
    
  // every click play sound
  function playSound() { 
    const audio = new Audio(click)
    audio.volume = 0.1
    audio.play()
  }


    return (
      <div
        className={`w-20 h-20 border border-gray-300 cursor-pointer hover:bg-green-100 ${
          isGreen ? 'bg-green-500' : ''
        }`}
        onClick={() => 
        //handleClick(id)
        playSound()
        }
      ></div>
    );
  };

export default Square