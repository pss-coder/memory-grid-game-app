import './App.css';
import GameBoard from './components/GameBoard';

function App() {
  return (
    <div className='container mx-auto m-4'>
        
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-xl font-bold '>Can you Memorise positions of green boxes?</h1>
          <p>Level: 1</p>
          <p>Timer: 00:04</p>
          <p>Selected Green Squares: 2/8</p>
        </div>
        

        {/* Gameboard */}
        <div class="flex justify-center items-center">
        <GameBoard
            level={0}
            gridSize={4}
            greenSquares={3}
            handleSquareClick={() => {
              // action to handle square
            } }
          />


          {/* <div class="grid grid-cols-3 gap-4">
            <div class="h-20 w-20 bg-green-500 hover:bg-green-700 cursor-pointer"></div>
            <div class="border-2 border-gray-500  h-20 w-20 "></div>
            <div class="h-20 w-20 bg-green-500"></div>
            <div class="h-20 w-20 bg-green-500"></div>
            <div class="h-20 w-20 bg-green-500"></div>
            <div class="h-20 w-20 bg-green-500"></div>
            <div class="h-20 w-20 bg-green-500"></div>
            <div class="h-20 w-20 bg-green-500"></div>
            <div class="h-20 w-20 bg-green-500"></div>
            
          </div> */}
        </div>

        
        
    </div>
  );
}

export default App;
