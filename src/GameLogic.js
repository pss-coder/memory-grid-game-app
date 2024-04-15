import { levels } from "./Levels";
import { areArrayEqual } from "./utils";

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

  export const isFinalLevel = (currentLevel) => {
    return currentLevel === levels.length
  }
  
  