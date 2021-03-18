import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';
import { Constant } from './Constant';
import { IConstantInfo } from './Interfaces';

const mockConstantData = {
  left: 100,
  top: 100,
  id: 123456789,
  type: "Constant",
  valueType: "Number",
  deleted: false,
  value: ''
}

const mockEditFn = jest.fn()
const mockHandleDropDownFn = jest.fn()
const mockMousedDownFn = jest.fn()
const mockMousedUpFn = jest.fn()



describe('The Constant Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('renders content correctly as number', () => {
    const { container } = renderConstantComponent();
    const draggableWrapper = container.querySelector('.constantContainer');
    expect(draggableWrapper).not.toBeNull();

    const input = container.querySelector('.varInput');
    expect(input).not.toBeNull();

    const type = container.querySelector('p');
    expect(type?.textContent).toBe('Number');

    expect(draggableWrapper).toHaveStyle('background-color: #90C4FF')
  });

  it('renders content correctly as boolean', () => {
    const data = { ...mockConstantData, valueType: "Boolean"}
    const { container } = renderConstantComponent(data);
    const draggableWrapper = container.querySelector('.constantContainer');
    expect(draggableWrapper).not.toBeNull();

    const input = container.querySelector('.varInput');
    expect(input).not.toBeNull();

    const type = container.querySelector('p');
    expect(type?.textContent).toBe('Boolean')
    expect(draggableWrapper).toHaveStyle('background-color: #90EDFF');
  });

  it('renders content correctly as string', () => {
    const data = { ...mockConstantData, valueType: "String"}
    const { container } = renderConstantComponent(data);
    const draggableWrapper = container.querySelector('.constantContainer');
    expect(draggableWrapper).not.toBeNull();

    const input = container.querySelector('.varInput');
    expect(input).not.toBeNull();

    const type = container.querySelector('p');
    expect(type?.textContent).toBe('String');
    expect(draggableWrapper).toHaveStyle('background-color: #90D5FF');
  });

  it('renders content correctly as Null', () => {
    const data = { ...mockConstantData, valueType: "Null"}
    const { container } = renderConstantComponent(data);
    const draggableWrapper = container.querySelector('.constantContainer');
    expect(draggableWrapper).not.toBeNull();

    const input = container.querySelector('.varInput');
    expect(input).not.toBeNull();

    expect(draggableWrapper).toHaveStyle('background-color: #90C4FF');
  });

  it('changes component value correctly', async () => {
    const { container } = renderConstantComponent();

    const input = container.querySelector('input') as Element;
    expect(input).not.toBeNull();

    await act(async () =>
    {
      fireEvent.click(input);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.change(input, { target: { value: "23" }})
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.keyDown(input, { key: "Enter", code: 13, keyCode: 13 });
      await new Promise(resolve => setTimeout(resolve, 0));
    })
    expect(mockEditFn).toBeCalledWith(mockConstantData, "23")
});

it('renders dropdown on right-click', async () => {
  const { container } = renderConstantComponent();

  const draggableWrapper = container.querySelector('.constantContainer') as Element;
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

const renderConstantComponent = (data = mockConstantData) => {
  return render(<Constant
    data={data as IConstantInfo}
    edit={mockEditFn}
    handleConstantDropDown={mockHandleDropDownFn}
    mousedDown={mockMousedDownFn}
    mousedUp={mockMousedUpFn}
    />)
};
