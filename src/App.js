import React, { useEffect, useReducer, useState } from 'react';
import './styles/App.css';
import GameBoard from './components/GameBoard';

import { levels } from './Levels';
import { areArrayEqual, playSound } from './utils';
import { generateGreenSquares} from './GameLogic';
import { type } from '@testing-library/user-event/dist/type';

function reducer(state, action) {
  const {type} = action

  switch(type) {
    case 'start': {
      return {...state, startGame: true}
    }
    case 'reset_timer': {
      return {...state, timer: 4}
    }
    case 'decrement_timer': {
      return {...state, timer: state.timer - 1}
    }
    case 'hide_answer': {
      return {
        ...state,
        displayGreenSquares: [],
        disableClick: false
      }
    }
    case 'generate_green_square': {
      // Update state with green squares
      const generatedGreenSquares = generateGreenSquares(state.selectedLevel.square, 0, state.selectedLevel.grid);
      return {
        ...state,
        greenSquares: generatedGreenSquares,
        displayGreenSquares: generatedGreenSquares,
        timer: 4
      }
    }
    case 'square_click': {

      const square_pos = action.square_pos
      console.log(square_pos)

      const prevSquares = state.clickedSquares
      const isAlreadyClicked = prevSquares.includes(square_pos);

      return {
        ...state,
        clickedSquares: isAlreadyClicked 
          ? prevSquares.filter(squareIndex => squareIndex !== square_pos)
          : [...prevSquares, square_pos]
      }
    }
    case 'increment': {
      if (state.level === levels.length) return;
      return {
        ...state,
        clickedSquares: [],
        greenSquares: [],
        displayGreenSquares: [],
        level: state.level + 1,
        selectedLevel: levels[state.level],
        gameState: null
      }

    }
    case 'reset': {
      // reset 
      const generatedGreenSquares = generateGreenSquares(state.selectedLevel.square, 0, state.selectedLevel.grid);

        return {
          ...state,
          clickedSquares: [],
          greenSquares: generatedGreenSquares,
          displayGreenSquares: generatedGreenSquares,
          level: 1,
          selectedLevel: levels[0],
          gameState: null,
          timer: 4
        }
    }
    case 'check_win': {
      console.log(state)
      // only if number of clicks matches selected squares required
      
        
        //setDisabledClick(true) // prevent click
        const disableClick = true
        var gameState = null
        var displayAnswer = null

        const isEqual = areArrayEqual(state.clickedSquares, state.greenSquares);
        

        if (isEqual) {
          
          if (state.level === levels.length) {
            gameState = 'gameWin'
            playSound('win');
            
          } else {
            gameState = 'levelComplete'
            playSound('level')
          }
          
        } 
        else {
          gameState = 'levelLoss';
          displayAnswer = state.greenSquares
          playSound('lose');
        }
        
        return {
          ...state,
          disableClick: disableClick,
          gameState: gameState,
          displayGreenSquares: displayAnswer != null ? displayAnswer : state.displayGreenSquares
        }
      
      }
    default:
      break
      return state
    }

  }

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
    const [state, dispatch] = useReducer(reducer, {
      startGame: false,
      greenSquares: [],
      displayGreenSquares: [],

      clickedSquares: [],
      disableClick: true,

      timer: 4,
      level: 1,
      selectedLevel: levels[0],

      gameState: null, // enum
    })

  // // States
  // const [startGame, setStartGame] = useState(false);

  // const [greenSquares, setGreenSquares] = useState([]);
  // const [displayGreenSquares, setDisplayGreenSquare] = useState([]);

  // const [clickedSquares, setClickedSquares] = useState([]);
  // const [disableClick, setDisabledClick] = useState(true);

  // const [timer, setTimer] = useState(4);

  // const [level, setLevel] = useState(1);
  // const [selectedLevel, setSelectedLevel] = useState(levels[0]);

  // const [gameState, setGameState] = useState(null); // "levelComplete" or "levelLoss"

  
  // Function to handle user click on a square
  const userClickSquare = index => {
    dispatch({type: 'square_click', square_pos: index })
  };

  // // Function to move to the next level
  // const incrementLevel = () => {
  //   if (level === levels.length) return;
  //   // Reset state for next level
  //   setClickedSquares([]);
  //   setGreenSquares([]);
  //   setDisplayGreenSquare([]);
  //   // Move to next level
  //   setLevel(level + 1);
  //   setSelectedLevel(levels[level]);
  //   setGameState(null);
  // };

  // // Function to reset the game
  // const resetGame = () => {
    
  //   // Reset state for next level
  //   setClickedSquares([]);
  //   // Move to next level
  //   setLevel(1);
  //   setSelectedLevel(levels[0]);
  //   setGameState(null);
  //   setTimer(4)
  // };

  // Effect to generate green squares for the selected level
  useEffect(() => {
    if (!state.startGame) return;

    // Update state with green squares
    dispatch({type: 'generate_green_square'})

    dispatch({type: 'reset_timer'})


  }, [state.selectedLevel, state.startGame]);

  // Effect to manage timer countdown
  useEffect(() => {
    if (!state.startGame) return;

    const countdown = setInterval(() => {
      if (state.timer > 0) {
        //setTimer(timer - 1);
        dispatch({type: 'decrement_timer'})
      }
      if (state.timer === 1) {
        // Hide green squares and enable clicks
        // hide_answer
        dispatch({type: 'hide_answer'})
        

      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [state.timer, state.startGame]);

  
  // Effect to check if user clicked all required squares
  useEffect(() => {
    if (!state.startGame) return;

    // only if number of clicks matches selected squares required
    if (state.clickedSquares.length === state.selectedLevel.square) {
      dispatch({type: 'check_win'})
    }
  }, [state.clickedSquares, state.gameState]);

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
                state.gameState === 'gameWin' ? 'Congrats, you won! Want to play again?' :
                state.gameState === 'levelComplete' ? 'Great, are you ready for the next level?' :
                state.gameState === 'levelLoss' ? 'Good Attempt, willing to go again?' :
                'Let the Hunt Begin!'
              }
            </p>
          <div className='flex flex-row gap-2'>
          <p>Level: <span className='font-bold'>{state.selectedLevel.level}</span> </p>
            <p className='text-md text-gray-600'>Timer:
              <span id="hours" className="ml-1">00</span>
              <span id="separator" className={`${state.startGame && 'animate-blink'}`}>:</span>
              <span id="minutes" className="font-bold">0{state.timer}</span>
            </p>
          </div>
        </div>

        <div className='mt-4 flex gap-4 flex-col sm:flex-row items-center justify-center'>
                {/* Gameboard */}
          <div className="flex flex-col justify-between items-center relative">
            <GameBoard
              level={state.level}
              gridSize={state.selectedLevel.grid}
              greenSquares={state.displayGreenSquares}
              disableClick={state.disableClick}
              handleSquareClick={userClickSquare}
              clickedSquares={state.clickedSquares}
              showAnswer={state.gameState === 'levelLoss'} // show answer only when level loss
            />
          </div>

          {/* Button */}
          {
            !state.startGame &&
            <button
              onClick={() => {
                //setStartGame(true);
                dispatch({type: 'start'})
              }}
              type="button"
              className={` absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              Start Game
            </button>
          }
          {
            state.gameState && (
              <button
                onClick={() => {
                  state.gameState === 'levelComplete' ? dispatch({type: 'increment'}) : dispatch({type: 'reset'});
                }}
                type="button"
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                {state.gameState === 'levelComplete' ? 'Next Level' : 'Restart Game'}
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
