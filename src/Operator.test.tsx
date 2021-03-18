import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';
import { Operator } from './Operator';
import { IFunctionInfo } from './Interfaces';

const mockOperatorData: IFunctionInfo = {
  id: 123456789,
  type: "Function",
  opType: "+",
  args: ["12345", "67890"],
  func: (a, b) => a + b,
  value: 0,
  deleted: false,
  color: "#EE5010"
}

const mockMousedDownFn = jest.fn()
const mockMousedUpFn = jest.fn()
const mockHandleDropDownFn = jest.fn();



describe('The Operator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('renders content correctly', () => {
    const { container } = renderOperatorComponent();
    const draggableWrapper = container.querySelector('.operatorContainer');
    expect(draggableWrapper).not.toBeNull();
    expect(draggableWrapper?.textContent).toBe("+");

    expect(draggableWrapper).toHaveStyle('background-color: #EE5010');

    const dataNodes = container.querySelectorAll('.node');
    expect(dataNodes.length).toBe(3);
  });

  it('handles dropdown click callback function', async () => {
    const { container } = renderOperatorComponent();
    const draggableWrapper = container.querySelector('.operatorContainer') as Element;
    
    await act(async () =>
    {
      fireEvent.contextMenu(draggableWrapper);
      await new Promise(resolve => setTimeout(resolve, 0));
    })
  
    const dropdown = container.querySelector('.dropDown');
    expect(dropdown).not.toBeNull();
  
    const selection = container.querySelector('.dropDownOption') as Element;
    await act(async () =>
    {
      fireEvent.click(selection);
      await new Promise(resolve => setTimeout(resolve, 0));
    })
    expect(mockHandleDropDownFn).toBeCalled();
  });
});

const renderOperatorComponent = (data = mockOperatorData) => {
  return render(<Operator
    operator={data as IFunctionInfo}
    mousedDown={mockMousedDownFn}
    mousedUp={mockMousedUpFn}
    handleOperatorDropDown={mockHandleDropDownFn}
    />)
};
