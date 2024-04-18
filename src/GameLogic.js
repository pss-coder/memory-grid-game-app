import { levels } from "./Levels";
import { areArrayEqual, exportCSV, playSound } from "./utils";

export const initialGameState = {
  // Initial States
  startGame: false,
  greenSquares: [],
  displayGreenSquares: [],

  clickedSquares: [],
  disableClick: true,

  timer: null,
  level: 1,
  selectedLevel: levels[0],

  gameState: null, // enum - gameWin, levelComplete, levelLoss  <- TODO: typescript future, tighter safety constraint

  levelTimeStart: null,
  gameHistory:  JSON.parse(localStorage.getItem('gameHistory')) || [],
  highestScore: JSON.parse(localStorage.getItem('highestScore')) || 0
}


export function gameHandler(state, action) {
  const {type} = action

  switch(type) {
    case 'start': {
      localStorage.setItem('gameHistory', JSON.stringify([]))
      return {...state, startGame: true, timer: 4, gameHistory: []}
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
      //console.log(square_pos)

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
      
      // reset storage
      localStorage.setItem('gameHistory', JSON.stringify([]))
        return {
          ...state,
          clickedSquares: [],
          greenSquares: generatedGreenSquares,
          displayGreenSquares: generatedGreenSquares,
          level: 1,
          selectedLevel: levels[0],
          gameState: null,
          timer: 4,
          gameHistory: []
        }
    }
    case 'check_win': {
      console.log(state)
      // only if number of clicks matches selected squares required
      //highestScore
      // if state.level > state.highestScore: update highestScore
      //localStorage.setItem('highestScore', JSON.stringify([]))
        
        //setDisabledClick(true) // prevent click
        const disableClick = true
        var gameState = null
        var displayAnswer = null

        var newHighestScore = state.highestScore

        const isEqual = areArrayEqual(state.clickedSquares, state.greenSquares);
        if (isEqual) {
          
          if (state.level === levels.length) {
            gameState = 'gameWin'
            playSound('win');
            
          } else {
            gameState = 'levelComplete'
            playSound('level')
          }

          // update highest score
          if (state.level > state.highestScore) {
            
            newHighestScore = state.level
            localStorage.setItem('highestScore', JSON.stringify(state.level))
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
          displayGreenSquares: displayAnswer != null ? displayAnswer : state.displayGreenSquares,
          highestScore: newHighestScore
        }
      
      }
      // to record time elapsed for each level
    case 'record_time_level': {
      //console.log("level recording")

      return {
        ...state,
        levelTimeStart: Date.now()
      }
    }
    case 'stop_time_level': {
      //console.log("level stop")
      const levelTime = Date.now() - state.levelTimeStart
      const formattedTime = levelTime / 1000; // Convert to seconds (rounded to 2 decimals)

      const updatedGameHistory = [...state.gameHistory, formattedTime]

      localStorage.setItem('gameHistory', JSON.stringify(updatedGameHistory))

      return {
        ...state,
        gameHistory: updatedGameHistory,
        levelTimeStart: null // reset start Time
      }
    }
    case 'export': {
      // perform export capability here
      exportCSV(state.gameHistory)

      return {...state}
    }
    default: //TODO: default, reset to initial state
      break
    }

  }

  // Function to generate random green squares
export const generateGreenSquares = (n, min, gridSize) => {
  const max = gridSize * gridSize;
  if (max - min + 1 < n) {
    throw new Error("Range is too small to generate unique numbers");
  }
  const generatedGreenSquares = [];
  while (generatedGreenSquares.length < n) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    if (generatedGreenSquares.indexOf(randomNumber) === -1 && randomNumber !== max) {
      generatedGreenSquares.push(randomNumber);
    }
  }

  return generatedGreenSquares
};
  
  