// Square component representing each square in the grid
const Square = ({ id, isGreen, handleClick }) => {
    return (
      <div
        className={`w-20 h-20 border border-gray-300 cursor-pointer hover:bg-green-100 ${
          isGreen ? 'bg-green-500' : ''
        }`}
        onClick={() => handleClick(id)}
      ></div>
    );
  };

export default Square