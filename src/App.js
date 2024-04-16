import React, { useEffect, useState } from 'react';
import './styles/App.css';
import GameBoard from './components/GameBoard';

import { levels } from './Levels';
import { areArrayEqual, playSound } from './utils';
import { generateGreenSquares} from './GameLogic';

function App() {

  //TODO: Consider using reducer?
    // start_game
    // generate_green_squares
    // square_click
    // check_win
    // increment_level
    // save_history
    // clear_history
    // export_game

  // States
  const [startGame, setStartGame] = useState(false);

  const [greenSquares, setGreenSquares] = useState([]);
  const [displayGreenSquares, setDisplayGreenSquare] = useState([]);

  const [clickedSquares, setClickedSquares] = useState([]);
  const [disableClick, setDisabledClick] = useState(true);

  const [timer, setTimer] = useState(4);

  const [level, setLevel] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState(levels[0]);

  const [gameState, setGameState] = useState(null); // "levelComplete" or "levelLoss"

  
  // Function to handle user click on a square
  const userClickSquare = index => {
    setClickedSquares(prevSquares => {
      const isAlreadyClicked = prevSquares.includes(index);
      return isAlreadyClicked
        ? prevSquares.filter(squareIndex => squareIndex !== index)
        : [...prevSquares, index];
    });
  };

  

  // Function to move to the next level
  const incrementLevel = () => {
    if (level === levels.length) return;
    // Reset state for next level
    setClickedSquares([]);
    setGreenSquares([]);
    setDisplayGreenSquare([]);
    // Move to next level
    setLevel(level + 1);
    setSelectedLevel(levels[level]);
    setGameState(null);
  };

  // Function to reset the game
  const resetGame = () => {
    
    // Reset state for next level
    setClickedSquares([]);
    // Move to next level
    setLevel(1);
    setSelectedLevel(levels[0]);
    setGameState(null);
    setTimer(4)

  };

  // Effect to generate green squares for the selected level
  useEffect(() => {
    if (!startGame) return;

    // Update state with green squares
    const generatedGreenSquares = generateGreenSquares(selectedLevel.square, 0, selectedLevel.grid);
    setGreenSquares(generatedGreenSquares);
    setDisplayGreenSquare(generatedGreenSquares);

    setTimer(4); // Reset timer
  }, [selectedLevel, startGame]);

  // Effect to manage timer countdown
  useEffect(() => {
    if (!startGame) return;

    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
      if (timer === 1) {
        // Hide green squares and enable clicks
        setDisplayGreenSquare([]);
        setDisabledClick(false);
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer, startGame]);

  
  // Effect to check if user clicked all required squares
  useEffect(() => {
    if (!startGame) return;
    
    // only if number of clicks matches selected squares required
    if (clickedSquares.length === selectedLevel.square) {
      setDisabledClick(true) // prevent click

      const isEqual = areArrayEqual(clickedSquares, greenSquares);
      if (isEqual) {
        
        if (level === levels.length) {
          setGameState('gameWin');
          playSound('win');
          
        } else {
          setGameState('levelComplete')
          playSound('level')
        }
        
      } 
      else {
        setGameState('levelLoss');
        setDisplayGreenSquare(greenSquares);
        playSound('lose');
      }
    }

  }, [clickedSquares, gameState]);

  return (
    <div className="flex justify-center items-center h-screen">
      
      <div className='container mx-auto'>
        
        {/* Header */}
        <div className='text-center'>
        <h1 className='text-3xl font-bold'>Squarehunt</h1>
          <p className='text-gray-400'>Can you hunt the green squares quickly?</p>
        </div>

        {/* Game Info */}
        <div className='flex flex-col justify-center items-center gap-2 text-center'>
        <p className='text-md font-semibold underline text-gray-800'>
              {
                gameState === 'gameWin' ? 'Congrats, you won! Want to play again?' :
                gameState === 'levelComplete' ? 'Great, are you ready for the next level?' :
                gameState === 'levelLoss' ? 'Good Attempt, willing to go again?' :
                'Let the Hunt Begin!'
              }
            </p>
          <div className='flex flex-row gap-2'>
          <p>Level: <span className='font-bold'>{selectedLevel.level}</span> </p>
            <p className='text-md text-gray-600'>Timer:
              <span id="hours" className="ml-1">00</span>
              <span id="separator" className={`${startGame && 'animate-blink'}`}>:</span>
              <span id="minutes" className="font-bold">0{timer}</span>
            </p>
          </div>
        </div>

        <div className='mt-4 flex gap-4 flex-col sm:flex-row items-center justify-center'>
                {/* Gameboard */}
          <div className="flex flex-col justify-between items-center relative">
            <GameBoard
              level={level}
              gridSize={selectedLevel.grid}
              greenSquares={displayGreenSquares}
              disableClick={disableClick}
              handleSquareClick={userClickSquare}
              clickedSquares={clickedSquares}
              showAnswer={gameState === 'levelLoss'} // show answer only when level loss
            />
          </div>

          {/* Button */}
          {
            !startGame &&
            <button
              onClick={() => {
                setStartGame(true);
              }}
              type="button"
              className={` absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              Start Game
            </button>
          }
          {
            gameState && (
              <button
                onClick={() => {
                  gameState === 'levelComplete' ? incrementLevel() : resetGame();
                }}
                type="button"
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                {gameState === 'levelComplete' ? 'Next Level' : 'Restart Game'}
              </button>
            )}

            <div className="rounded-lg bg-yellow-200">
      <div className="flex flex-row gap-2 mb-2">
        <h3 className="font-bold">Game History</h3>
        <button className="button bg-slate-100 button-primary">Export</button>
      </div>

      {/* ScorePanel */}
      <div className="w-64 h-64 overflow-y-scroll shadow scroll-smooth">
          <ul className="list-none">
          <li>Level 1: Time Taken - <span id="level-1-time">02:40s</span></li>
          <li>Level 2: Time Taken - <span id="level-1-time">02:40s</span></li>
          <li>Level 3: Time Taken - <span id="level-1-time">02:40s</span></li>
          <li>Level 4: Time Taken - <span id="level-1-time">02:40s</span></li>
          <li>Level 5: Time Taken - <span id="level-1-time">02:40s</span></li>
          <li>Level 6: Time Taken - <span id="level-1-time">02:40s</span></li>
          <li>Level 7: Time Taken - <span id="level-1-time">02:40s</span></li>
          <li>Level 8: Time Taken - <span id="level-1-time">02:40s</span></li>
          <li>Level 9: Time Taken - <span id="level-1-time">02:40s</span></li>
          <li>Level 10: Time Taken - <span id="level-1-time">02:40s</span></li>
        </ul>
      </div>
        
        
  </div>


        </div>

       
      </div>
    </div>
  );
}

export default App;
