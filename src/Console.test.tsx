import React from 'react';
import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import { Console } from './Console';

describe('The Console Component', () => {
  it('renders output correctly', () => {
    const { container } = render(<Console output={['Test1', 'Test2']} width={300}/>);
    const outputs = container.querySelectorAll('.output');
    expect(outputs.length).toBe(2);
    expect(outputs[0].textContent).toBe('Test1');
    expect(outputs[1].textContent).toBe('Test2');
  });

  it('changes width on window resize', async () => {
    const { container } = render(<Console output={['Test1', 'Test2']} width={300}/>);
    await act( async () => {
      global.innerWidth = 1024;

    // Trigger the window resize event.
    global.dispatchEvent(new Event('resize'));
    })
    const console = container.querySelector('.console')
    expect(console).toHaveStyle('width: -8.666666666666686px');
    await act( async () => {
      global.innerWidth = 500;

    // Trigger the window resize event.
    global.dispatchEvent(new Event('resize'));
    })

    expect(console).toHaveStyle('width: -183.33333333333334px');
  })
});
