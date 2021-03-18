import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';
import { InputComponent, Variable } from './Variable';
import { IVariableInfo } from './Interfaces';

const mockVariableData: IVariableInfo = {
  left: 100,
  top: 100,
  id: 123456789,
  type: "Variable",
  valueType: "Number",
  deleted: false,
  value: '',
  args: [1, 2],
  name: "",
  func: jest.fn()
}

const mockEditFn = jest.fn()
const mockHandleDropDownFn = jest.fn()
const mockMousedDownFn = jest.fn()
const mockMousedUpFn = jest.fn()



describe('The Variable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('renders content correctly as number', () => {
    const { container } = renderVariableComponent();
    const draggableWrapper = container.querySelector('.variableContainer');
    expect(draggableWrapper).not.toBeNull();

    const input = container.querySelector('.varInput');
    expect(input).not.toBeNull();

    const type = container.querySelector('p');
    expect(type?.textContent).toBe('Number');

    expect(draggableWrapper).toHaveStyle('background-color: #B290FF')
  });

  it('renders content correctly as boolean', () => {
    const data = { ...mockVariableData, valueType: "Boolean"}
    const { container } = renderVariableComponent(data);
    const draggableWrapper = container.querySelector('.variableContainer');
    expect(draggableWrapper).not.toBeNull();

    const input = container.querySelector('.varInput');
    expect(input).not.toBeNull();

    const type = container.querySelector('p');
    expect(type?.textContent).toBe('Boolean')
    expect(draggableWrapper).toHaveStyle('background-color: #90ADFF');
  });

  it('renders content correctly as string', () => {
    const data = { ...mockVariableData, valueType: "String"}
    const { container } = renderVariableComponent(data);
    const draggableWrapper = container.querySelector('.variableContainer');
    expect(draggableWrapper).not.toBeNull();

    const input = container.querySelector('.varInput');
    expect(input).not.toBeNull();

    const type = container.querySelector('p');
    expect(type?.textContent).toBe('String');
    expect(draggableWrapper).toHaveStyle('background-color: #9090FF');
  });

  it('renders content correctly as Null', () => {
    const data = { ...mockVariableData, valueType: "Null"}
    const { container } = renderVariableComponent(data);
    const draggableWrapper = container.querySelector('.variableContainer');
    expect(draggableWrapper).not.toBeNull();

    const input = container.querySelector('.varInput');
    expect(input).not.toBeNull();

    expect(draggableWrapper).toHaveStyle('background-color: #B290FF');
  });

  it('changes component value correctly', async () => {
    const { container } = renderVariableComponent();

    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBe(2);

    await act(async () =>
    {
      fireEvent.click(inputs[0]);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.change(inputs[0], { target: { value: "x" }})
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.keyDown(inputs[0], { key: "Enter", code: 13, keyCode: 13 });
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.click(inputs[1]);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.change(inputs[1], { target: { value: "23" }})
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.keyDown(inputs[1], { key: "Enter", code: 13, keyCode: 13 });
      await new Promise(resolve => setTimeout(resolve, 0));
    })
    expect(mockEditFn).toHaveBeenCalledWith(mockVariableData, "x")
    expect(mockEditFn).toHaveBeenCalledWith(mockVariableData, "x", "23")
  });

  it('renders dropdown on right-click', async () => {
    const { container } = renderVariableComponent();

    const draggableWrapper = container.querySelector('.variableContainer') as Element;
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

const renderVariableComponent = (data = mockVariableData) => {
  return render(<Variable
    data={data as IVariableInfo}
    edit={mockEditFn}
    handleVariableDropDown={mockHandleDropDownFn}
    mousedDown={mockMousedDownFn}
    mousedUp={mockMousedUpFn}
    />)
};


describe('The Input Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('changes to input mode and back to confirmed mode (general case)', async () => {
    const { container } = renderInputComponent();

    let input = container.querySelector('input') as Element;
    expect(input).not.toBeNull();

    await act(async () =>
    {
      fireEvent.click(input);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.change(input, { target: { value: "x" }})
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.keyDown(input, { key: "Enter", code: 13, keyCode: 13 });
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    input = container.querySelector('input') as Element;
    expect(input).toBeNull();

    const confirmedInput = container.querySelector('.varConfirmed') as Element;
    expect(confirmedInput).not.toBeNull();

    await act(async () =>
    {
      fireEvent.click(confirmedInput);
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    input = container.querySelector('input') as Element;
    expect(input).not.toBeNull();
  });

  it('changes to input mode and back to confirmed mode (variable name case)', async () => {
    const { container, rerender } = renderInputComponent('varName');

    let input = container.querySelector('input') as Element;
    expect(input).not.toBeNull();

    await act(async () =>
    {
      fireEvent.click(input);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.change(input, { target: { value: "x" }})
      await new Promise(resolve => setTimeout(resolve, 0));

      rerender(<InputComponent
        value="x"
        name="varName"
        onChange={mockChangeFn}
        confirmFn={mockConfirmFn}
        />)

        fireEvent.keyDown(input, { key: "Enter", code: 13, keyCode: 13 });
        await new Promise(resolve => setTimeout(resolve, 0));
        
      })
    expect(mockChangeFn).toHaveBeenCalledWith("x");
    expect(mockConfirmFn).toHaveBeenCalled();
    input = container.querySelector('input') as Element;
    expect(input).toBeNull();

    const confirmedInput = container.querySelector('.varConfirmed') as Element;
    expect(confirmedInput).not.toBeNull();

    await act(async () =>
    {
      fireEvent.click(confirmedInput);
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    input = container.querySelector('input') as Element;
    expect(input).not.toBeNull();
  });
 
});

const mockChangeFn = jest.fn();
const mockConfirmFn = jest.fn();

const renderInputComponent = (name = 'valName') => {
  return render(<InputComponent
    value=""
    name={name}
    onChange={mockChangeFn}
    confirmFn={mockConfirmFn}
    />)
};
