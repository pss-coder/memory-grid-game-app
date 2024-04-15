import click from './assets/click.wav'
import game_complete from './assets/game_complete.mp3'
import level_up from './assets/level_up.ogg'
import try_again from './assets/try_again.wav'

export const playSound = (type) => { 
    if (type === 'level') {
      const audio = new Audio(level_up)
      audio.volume = 0.5
      audio.play()
    } else if (type === 'win') {
      const audio = new Audio(game_complete)
      audio.volume = 0.8
      audio.play()
    } else if (type === 'lose') {
      const audio = new Audio(try_again)
      audio.volume = 0.8
      audio.play()
    } else if (type === 'click') {
        const audio = new Audio(click)
    audio.volume = 0.1
    audio.play()
    }
    
  }

 // Helper Function to check if two arrays are equal
 export const areArrayEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }
    arr1.sort();
    arr2.sort();
    // Check if every element in the arrays is equal
    return arr1.every((value, index) => value === arr2[index]);
  };