import React, { useEffect, useState } from 'react';
import './styles/App.css';
import GameBoard from './components/GameBoard';

import { levels } from './Levels';
import { areArrayEqual, playSound } from './utils';
import { generateGreenSquares} from './GameLogic';

function App() {

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
    console.log("resetting game")
    // Reset state for new game

    // Reset to the first level
    setLevel(1);
    setSelectedLevel(levels[0]);
    setTimer(4)
    setGameState(null);

    setClickedSquares([]);
    setGreenSquares([]);
    setDisplayGreenSquare([]);
    

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
    
    if (clickedSquares.length === selectedLevel.square && !gameState) {
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
          <h1 className='text-xl font-bold '>Can you Memorise Positions of the Green Boxes Quickly?</h1>
          <div className='game-info'>
            <p className='text-2xl text-gray-800'>Level: {selectedLevel.level}</p>
            <p className='text-md text-gray-600'>Timer:
              <span id="hours" className="ml-2">0</span>
              <span id="separator" className={`${startGame && 'animate-blink'}`}>:</span>
              <span id="minutes" className="2">0{timer}</span>
            </p>
          </div>
        </div>
        {/* Gameboard */}
        <div className="mt-8 flex flex-col justify-between items-center relative">
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
      </div>
    </div>
  );
}

export default App;
