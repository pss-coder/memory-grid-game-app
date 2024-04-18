import React, { useEffect, useReducer } from 'react';
import { gameHandler, initialGameState} from './GameLogic';
import GameBoard from './components/GameBoard';
import './styles/App.css';


function App() {
    const [state, dispatch] = useReducer(gameHandler, initialGameState )


  // Function to handle user click on a square
  const userClickSquare = index => { dispatch({type: 'square_click', square_pos: index })};

  const onLevelIncrement = () => { ; dispatch({type: 'increment'})}
  const onGameReset = () => { dispatch({type: 'reset'})}

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
      if (state.timer > 0) { dispatch({type: 'decrement_timer'}) }
      if (state.timer === 1) { 
        dispatch({type: 'hide_answer'}) 
        dispatch({type:'record_time_level'}) // start recording time, once time for user turn to play
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [state.timer]);

  
  // Effect to check if user clicked all required squares
  useEffect(() => {
    if (!state.startGame) return;

    // only if number of clicks matches selected squares required
    if (state.clickedSquares.length === state.selectedLevel.square) {
      dispatch({type: 'check_win'})

      dispatch({type:'stop_time_level'})
    }
  }, [state.clickedSquares]);
  // [state.clickedSquares, state.gameState]
  

  return (
    <div className="flex justify-center items-center h-screen">
      
      <div className='round-lg shadow container mx-auto mt-16 bg-teal-50 py-4'>
        
        {/* Header */}
        <div className='text-center mt-4'>
        <h1 className='text-3xl font-bold'>Squarehunt</h1>
          <p className='text-gray-400'>Can you hunt the green squares quickly?</p>
          <p>Highest Score Level: {state.highestScore}</p>
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
        

        <div className='mt-4 flex gap-12 flex-col sm:flex-row items-center justify-center'>
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
                onClick={() => { state.gameState === 'levelComplete' ? onLevelIncrement()
                : onGameReset()
                }}
                type="button"
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                {state.gameState === 'levelComplete' ? 'Next Level' : 'Restart Game'}
              </button>
            )}

            <div className="rounded-lg bg-yellow-200 p-2 shadow">
                {/* Panel Header */}
                <div className="flex flex-row gap-2 mb-2 mt-2 justify-center">
                  <h3 className="font-bold">Game History</h3>
                  <button className="
                  rounded-lg bg-indigo-600 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => {
                    dispatch({type: 'export'})
                  }}
                  >
                  Export</button>
                </div>

                {/* Time-Taken Panel */}
                <div className="w-64 h-64 overflow-y-scroll  scroll-smooth">
                    <ul className="list-none">
                    {state.gameHistory.map( (elapsedTime, index) => { return (
                      <li key={index}> Level {index + 1}: {elapsedTime} seconds</li>  
                    )})}
                  </ul>
                </div>
            </div>


        </div>

       
      </div>
    </div>
  );
}

export default App;
