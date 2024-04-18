import { initialGameState, gameHandler, generateGreenSquares } from '../GameLogic';

test('initial state is set correctly', () => {
  expect(initialGameState).toEqual({
    startGame: false,
    greenSquares: [],
    displayGreenSquares: [],
    clickedSquares: [],
    disableClick: true,
    timer: null,
    level: 1,
    selectedLevel: { level: 1, grid: 3, square: 3 },
    gameState: null,
    levelTimeStart: null,
    gameHistory: [],
    highestScore: 0,
  });
});

describe('Gamelogic', () => {
  describe('initialGameState', () => {
    it('should set all properties correctly', () => {
      const state = initialGameState;
      expect(state.startGame).toBe(false);
      expect(state.greenSquares).toEqual([]);
      expect(state.displayGreenSquares).toEqual([]);
      expect(state.clickedSquares).toEqual([]);
      expect(state.disableClick).toBe(true);
      expect(state.timer).toBeNull();
      expect(state.level).toBe(1);
      expect(state.gameState).toBeNull();
      expect(state.levelTimeStart).toBeNull();
      expect(state.gameHistory).toEqual([]);
      expect(state.highestScore).toBe(0); // Assuming default value
    });
  });

  describe('gameHandler', () => {
    let state;

    beforeEach(() => {
      state = initialGameState;
    });

    it('should handle start action', () => {
      const newState = gameHandler(state, { type: 'start' });
      expect(newState.startGame).toBe(true);
      expect(newState.timer).toBe(4);
      expect(newState.gameHistory).toEqual([]);
    });

    it('should handle reset_timer action', () => {
      state.timer = 2;
      const newState = gameHandler(state, { type: 'reset_timer' });
      expect(newState.timer).toBe(4);
    });

    it('should handle decrement_timer action', () => {
      state.timer = 3;
      const newState = gameHandler(state, { type: 'decrement_timer' });
      expect(newState.timer).toBe(2);
      expect(newState.timer).toBeGreaterThanOrEqual(0);
    });

    it('should handle hide_answer action', () => {
      state.displayGreenSquares = [1, 2];
      const newState = gameHandler(state, { type: 'hide_answer' });
      expect(newState.displayGreenSquares).toEqual([]);
      expect(newState.disableClick).toBe(false);
    });

    it('should handle generate_green_square action', () => {
      const level = { square: 3, grid: 4 };
      const newState = gameHandler(state, { type: 'generate_green_square' });
      expect(newState.greenSquares.length).toBe(level.square);
      expect(newState.displayGreenSquares.length).toBe(level.square);
      expect(newState.timer).toBe(4);
      newState.greenSquares.forEach(square => expect(square).toBeGreaterThanOrEqual(0));
      newState.greenSquares.forEach(square => expect(square).toBeLessThan(level.grid * level.grid));
    });

    // Square Click Tests (need to mock generateGreenSquares for reliable testing)
    it('should handle square_click (add square)', () => {
      state = gameHandler(state, { type: 'generate_green_square' });
      const newState = gameHandler(state, { type: 'square_click', square_pos: 1 });
      expect(newState.clickedSquares).toEqual([1]);
    });

    it('should handle square_click (remove square)', () => {
      state = gameHandler(state, { type: 'generate_green_square' });
      state = gameHandler(state, { type: 'square_click', square_pos: 1 });
      state = gameHandler(state, { type: 'square_click', square_pos: 1 });
      expect(state.clickedSquares).toEqual([]);
    });

    it('should handle increment action', () => {
      const newState = gameHandler(state, { type: 'increment' });
      expect(newState.clickedSquares).toEqual([]);
      expect(newState.greenSquares).toEqual([]);
      
      expect(newState.displayGreenSquares).toEqual([]);
      expect(newState.level).toBe(2);
      expect(newState.gameState).toBeNull();
    });

    it('should handle reset action', () => {
      const newState = gameHandler(state, { type: 'reset' });
      expect(newState.clickedSquares).toEqual([]);
      expect(newState.greenSquares.length).toBe(3);
      expect(newState.displayGreenSquares.length).toBe(3);
      expect(newState.level).toBe(1);
      expect(newState.gameState).toBeNull();
      expect(newState.timer).toBe(4);
      expect(newState.gameHistory).toEqual([]);
      jest.restoreAllMocks();
    });

    it('should handle record_time_level', () => {
      const newState = gameHandler(state, { type: 'record_time_level' });
      expect(newState.levelTimeStart).not.toBeNull();
    });

    it('should handle stop_time_level', () => {
      jest.spyOn(Date, 'now').mockImplementation(() => 1000);
      state.levelTimeStart = 500;
      const newState = gameHandler(state, { type: 'stop_time_level' });
      expect(newState.gameHistory.length).toBe(1);
      expect(newState.levelTimeStart).toBeNull();
      jest.restoreAllMocks();
    });

  });

  describe('generateGreenSquares', () => {
    it('should generate unique squares within the grid range', () => {
      const n = 2;
      const min = 0;
      const gridSize = 4;
      const generatedSquares = generateGreenSquares(n, min, gridSize);
      expect(generatedSquares.length).toBe(n);
      const squaresSet = new Set(generatedSquares);
      expect(squaresSet.size).toBe(n); // Ensures no duplicates
      generatedSquares.forEach(square => expect(square).toBeGreaterThanOrEqual(min));
      generatedSquares.forEach(square => expect(square).toBeLessThan(gridSize * gridSize));
    });
  });
});

