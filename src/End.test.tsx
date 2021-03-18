import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';
import { End } from './End';
import { IEnd } from './Interfaces';

const mockEndData: IEnd = {
  id: 123456789,
  type: "End",
  valueType: "Number",
  deleted: false,
  args: [null, null],
  func: e => e,
  value: null
}

const mockMousedDownFn = jest.fn()
const mockMousedUpFn = jest.fn()



describe('The End Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('renders content correctly as number', () => {
    const { container } = renderEndComponent();
    const draggableWrapper = container.querySelector('.endContainer');
    expect(draggableWrapper).not.toBeNull();
    expect(draggableWrapper?.textContent).toBe("End");

    expect(draggableWrapper).toHaveStyle('background-color: #FF6F6F');
  });
});

const renderEndComponent = (data = mockEndData) => {
  return render(<End
    data={data as IEnd}
    mousedDown={mockMousedDownFn}
    mousedUp={mockMousedUpFn}
    />)
};
