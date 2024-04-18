import { playSound, areArrayEqual, exportCSV } from '../utils';

describe('playSound', () => {
  test('plays the correct sound for "level"', () => {
    const audioMock = jest.spyOn(window, 'Audio').mockImplementation(() => ({
      volume: 0.5,
      play: jest.fn(),
    }));
    playSound('level');
    expect(audioMock).toHaveBeenCalledWith('level_up.mp3');
  });

  // Add similar tests for other sound types (win, lose, click)
});

describe('areArrayEqual', () => {
  test('returns true for equal arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    expect(areArrayEqual(arr1, arr2)).toBe(true);
  });

  // Add more tests for different scenarios (e.g., arrays of different lengths, different elements, etc.)
});

describe('exportCSV', () => {
  test('exports data to CSV format', () => {
    const data = [10, 20, 30];
    const filename = 'test.csv';
    const blobMock = jest.fn();
    const URLMock = {
      createObjectURL: jest.fn(() => 'test-url'),
      revokeObjectURL: jest.fn(),
    };
    global.Blob = blobMock;
    global.window.URL = URLMock;
    global.document.body.appendChild = jest.fn();
    global.document.body.removeChild = jest.fn();

    exportCSV(data, filename);
    expect(blobMock).toHaveBeenCalledWith(['\"Levels\",\"ElapsedTime\"\n1,10\n2,20\n3,30'], { type: 'text/csv;charset=utf-8' });
    expect(URLMock.createObjectURL).toHaveBeenCalledWith({});
    expect(URLMock.revokeObjectURL).toHaveBeenCalledWith('test-url');
  });

  // Add more tests for different scenarios (e.g., empty data, custom filename, etc.)
});
