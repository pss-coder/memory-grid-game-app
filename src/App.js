import React, { useEffect, useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';

function App() {
  // Game Levels
  const levels = [
    { level:1 ,grid: 3, square: 3 },
    { level:2, grid: 3, square: 4 },
    { level:3, grid: 4, square: 4 },
    { level:4, grid: 4, square: 5 },
    { level:5, grid: 4, square: 6 },
    { level:6, grid: 5, square: 5 },
    { level:7,  grid: 5, square: 6 },
    { level:8,  grid: 5, square: 7 },
    { level:9,  grid: 6, square: 6 },
    { level:10,  grid: 7, square: 7 }
  ];

  // States
  const [startGame, setStartGame] = useState(false)

  const [greenSquares, setGreenSquares] = useState([]);
  const [displayGreenSquares, setDisplayGreenSquare] = useState([]);
  const [clickedSquares, setClickedSquares] = useState([]);

  const [disableClick, setDisabledClick] = useState(true);

  const [timer, setTimer] = useState(4);

  const [level, setLevel] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState(levels[level - 1]);

  // Button State
  const [hideStartButton, setHideStartButton] = useState(false)

  // Function to generate random green squares
  const generateGreenSquares = (n, min, gridSize) => {
    const max = gridSize * gridSize;
    if (max - min + 1 < n) {
      throw new Error("Range is too small to generate unique numbers");
    }
    const randomSquareIndex = [];
    while (randomSquareIndex.length < n) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      if (randomSquareIndex.indexOf(randomNumber) === -1 && randomNumber !== max) {
        randomSquareIndex.push(randomNumber);
      }
    }
    // Update state with green squares
    setGreenSquares(randomSquareIndex);
    setDisplayGreenSquare(randomSquareIndex);
  };

  // Helper Function to check if two arrays are equal
  const areArrayEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }
    arr1.sort();
    arr2.sort();
    // Check if every element in the arrays is equal
    return arr1.every((value, index) => value === arr2[index]);
  };

  // Function to handle user click on a square
  const userClickSquare = index => {
    const isAlreadyClicked = clickedSquares.includes(index);
    if (!isAlreadyClicked) {
      // Add clicked square to state
      setClickedSquares(prevSquaresIndex => [...prevSquaresIndex, index]);
    } else {
      // Remove clicked square from state
      const updatedSquares = clickedSquares.filter(squareIndex => squareIndex !== index);
      setClickedSquares(updatedSquares);
    }
  };

  // Function to move to the next level
  const incrementLevel = () => {
    if (level === levels.length - 1) return;
    // Reset state for next level
    setDisabledClick(true);
    setClickedSquares([]);
    setGreenSquares([]);
    setDisplayGreenSquare([]);
    // Move to next level
    setLevel(level + 1);
    setSelectedLevel(levels[level]);
  };

  // Function to reset the game
  const resetGame = () => {
    if (level === levels.length) return;
    // Reset state for new game
    setDisabledClick(true);
    setClickedSquares([]);
    setGreenSquares([]);
    setDisplayGreenSquare([]);
    // Reset to the first level
    setLevel(0);
    setSelectedLevel(levels[0]);
  };

  // Effect to generate green squares for the selected level
  useEffect(() => {
    if (!startGame) return;

    generateGreenSquares(selectedLevel.square, 0, selectedLevel.grid);
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

    if (clickedSquares.length === selectedLevel.square) {
      const isEqual = areArrayEqual(clickedSquares, greenSquares);
      if (isEqual) {
        // Move to next level if squares are correct
        alert( selectedLevel.level === 10 ?  "You Made it! Wow, you have great memory!" : "Great Job! Moving to next level!" );
        
        incrementLevel();
      } else {
        // Reset game if squares are incorrect
        
        setHideStartButton(false)
        setStartGame(false)

        resetGame();
        
        alert("You Lose, try again!");
      }
    }
  }, [clickedSquares, startGame]);

  return (
    <div className='container mx-auto m-4'>
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-xl font-bold '>Can you Memorise positions of green boxes?</h1>
        <p>Level: {selectedLevel.level}</p>
        <p>Timer: 00:0{timer}</p>
        <p>Selected Green Squares: {clickedSquares.length}/{selectedLevel.square}</p>
        {/* Button to start game */}
        <button 
          onClick={() => {
            setStartGame(true) 
            setHideStartButton(true) } }
          type="button"
          className={`${hideStartButton && 'hidden' } text-center rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
        >
          Start Game
        </button>       
      </div>
      {/* Gameboard */}
      <div className="flex justify-center items-center">
        <GameBoard
          level={level}
          gridSize={selectedLevel.grid}
          greenSquares={displayGreenSquares}
          disableClick={disableClick}
          handleSquareClick={userClickSquare}
          clickedSquares={clickedSquares}
        />
      </div> 
    </div>
  );
}

export default App;
