import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
  });

  test('starts the game when "Start Game" button is clicked', async () => {
    const { getByText } = render(<App />);
    const startButton = getByText('Start Game');
    fireEvent.click(startButton);
    await waitFor(() => {
      expect(getByText('Level:')).toBeInTheDocument();
    });
  });

  // Add more test cases for other functionalitiesw
});
