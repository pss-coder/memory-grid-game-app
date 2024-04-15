import { useEffect, useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';


// Game Levels

function App() {

  // Level
  const levels = [
    {
      grid: 3,
      square: 3
    },
    {
      grid: 3,
      square: 4,
    },
    {
      grid: 4,
      square: 4,
    },
    {
      grid: 4,
      square: 5
    },
    {
      grid: 4,
      square: 6
    },
    {
      grid: 5,
      square: 5
    },
    {
      grid: 5,
      square: 6
    },
    {
      grid: 5,
      square: 7
    },
    {
      grid: 6,
      square: 6
    },
    {
      grid: 7,
      square: 7
    }
  ]

  // Initialise State
  const [greenSquares, setGreenSquares] = useState([]); // denotes squares user to remember to click

  const [displayGreenSquares, setDisplayGreenSquare] = useState([]) // this is for display, for timer to hide afterwards

  const [clickedSquares, setClickedSquares] = useState([]); // square user clicked
  const [disableClick, setDisabledClick] = useState(true)

  const [timer, setTimer] = useState(4); // timer to display squares for x period of time

  
  const [levelIndex, setLevelIndex] = useState(0)
  const [selectedLevel, setSelectedLevel] = useState(levels[levelIndex]) // default level 1

  // How to?
    // Randomly pick y squares to display depending on x * x grid square
      // for example 3x3 -> 3 squares
      // for 4x4 -> 

  // n -> number of green square for usre to memorise
    // min -> 0
    // max -> range
    function generateGreenSquares(n, min, gridSize) {
        
      const max = gridSize * gridSize 
      // e.g: 3x3 -> 9, n=3, pick 3 random squares from the 9 squares

      if (max - min + 1 < n) {
        throw new Error("Range is too small to generate unique numbers");
    }

    const randomSquareIndex = [];
    while (randomSquareIndex.length < n) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        if (randomSquareIndex.indexOf(randomNumber) === -1 && randomNumber !== max ) {
          randomSquareIndex.push(randomNumber);
        }
    }
    //return randomSquareIndex;
      //console.log(randomSquareIndex.length)
      setGreenSquares(randomSquareIndex)
      setDisplayGreenSquare(randomSquareIndex)

  }

  function areArrayEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    arr1.sort()
    arr2.sort()

    const len = arr1.length
    for (let index = 0; index < len; index++) {
      if (arr1[index] !== arr2[index]) {
          return false
      }

    }

    return true;
}

  function userClickSquare(index) {
    const isAlreadyClicked = clickedSquares.includes(index);

    // Update Click Square
    if (!isAlreadyClicked) {
      setClickedSquares(prevSquaresIndex => {return [...prevSquaresIndex, index]; });
    } else {
      const updatedSquares = clickedSquares.filter((squareIndex) => squareIndex !== index);
      setClickedSquares(updatedSquares);
    }
  }

  function incrementLevel() {
    // TODO: guard case
    if (levelIndex === levels.length) return

    // reset clicked squares and disable click
    setDisabledClick(true)
    setClickedSquares([])

    setGreenSquares([])
    setDisplayGreenSquare([])

    // move up level
    setLevelIndex(levelIndex + 1)
    setSelectedLevel(levels[levelIndex])

    console.log(levels[levelIndex])
  }

  function resetGame() {
     // TODO: guard case
     if (levelIndex === levels.length) return

     // reset clicked squares and disable click
     setDisabledClick(true)
     setClickedSquares([])
 
     setGreenSquares([])
     setDisplayGreenSquare([])
 
       // move up level
     setLevelIndex(0)
     setSelectedLevel(levels[0])
  }

  // for when level changes
  useEffect(() => {
    //console.log("updating number of green sqaure every level")
    generateGreenSquares(selectedLevel.square, 0, selectedLevel.grid)

    // reset timer
    setTimer(4)


  }, [selectedLevel])

  // when timer changes
  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
      if (timer === 1) {
        setDisplayGreenSquare([])
        
        setDisabledClick(false) // allow user to click
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer])

  // when square clicked
  useEffect(() => {
    // perform a check
    if (clickedSquares.length === selectedLevel.square) {

      

      console.log("same length")
      const isEqual = areArrayEqual(clickedSquares, greenSquares)
      if (isEqual) {
        // Move to next level
        //alert("great! moving to next level")
        console.log("move to next level")
        incrementLevel()
      } else {
        //TODO: allow try again attempt
        // restart again
        resetGame()
        alert("wrong")

      }
}
  }, [clickedSquares])


  return (
    <div className='container mx-auto m-4'>
        
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-xl font-bold '>Can you Memorise positions of green boxes?</h1>
          <p>Level: {levelIndex+1}</p>
          <p>Timer: 00:0{timer}</p>
          <p>Selected Green Squares: {clickedSquares.length}/{selectedLevel.square}</p>

          <button 
        onClick={() => incrementLevel() }
        type="button"
        className="text-center rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
        Start Game
        </button>       

        </div>
        

        {/* Gameboard */}
        <div className="flex justify-center items-center">
        <GameBoard
            level={levelIndex}
            gridSize={selectedLevel.grid}
            greenSquares={displayGreenSquares}
            disableClick = {disableClick}
            handleSquareClick={userClickSquare}
            clickedSquares={clickedSquares}
          />

        </div> 
    </div>
  );
}

export default App;
