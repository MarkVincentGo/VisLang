import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import App from './App';

test('renders title, canvas, and console', () => {
  const { container } = render(<App />);
  const title = container.querySelector('.top');
  expect(title).toBeInTheDocument();
  expect(title?.textContent).toBe('VLANG')
});

