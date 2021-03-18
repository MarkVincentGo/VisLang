import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';
import { Draggable } from './Draggable';
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

const mockOnContextMenuFn = jest.fn()
const mockContextMenuClick = jest.fn()



describe('The Draggable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('renders content correctly', () => {
    const { container } = renderConstantComponent();
    const draggableWrapper = container.querySelector('.variable');
    expect(draggableWrapper).not.toBeNull();
  });

  it('renders gets active styling when mouse is in bounds', async () => {
    const { container } = renderConstantComponent();

    const draggableWrapper = container.querySelector('.variable') as Element;
    expect(draggableWrapper).not.toBeNull();

    let activeClassing = container.querySelector('.active');
    expect(activeClassing).toBeNull();

    await act(async () =>
    {
      fireEvent.mouseOver(draggableWrapper);
      await new Promise(resolve => setTimeout(resolve, 0));
    })
    activeClassing = container.querySelector('.active');
    expect(activeClassing).not.toBeNull();
  });

  it('renders removes active styling when mouse is in bounds', async () => {
    const { container } = renderConstantComponent();

    const draggableWrapper = container.querySelector('.variable') as Element;
    expect(draggableWrapper).not.toBeNull();

    let activeClassing = container.querySelector('.active');
    expect(activeClassing).toBeNull();

    await act(async () =>
    {
      fireEvent.mouseOver(draggableWrapper);
      await new Promise(resolve => setTimeout(resolve, 0));
    })
    activeClassing = container.querySelector('.active');
    expect(activeClassing).not.toBeNull();

    await act(async () =>
    {
      fireEvent.mouseLeave(draggableWrapper);
      await new Promise(resolve => setTimeout(resolve, 0));
    })
    activeClassing = container.querySelector('.active');
    expect(activeClassing).toBeNull();
  });

  it('renders contextMenu on right click', async () => {
    const { container } = renderConstantComponent();

    const draggableWrapper = container.querySelector('.variable') as Element;
    expect(draggableWrapper).not.toBeNull();

    let dropdown = container.querySelector('.dropDown') as Element;
    expect(dropdown).toBeNull();

    await act(async () =>
    {
      fireEvent.mouseOver(draggableWrapper);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.contextMenu(draggableWrapper);
      await new Promise(resolve => setTimeout(resolve, 0));
    })
    dropdown = container.querySelector('.dropDown') as Element;
    expect(dropdown).not.toBeNull();

    await act(async () =>
    {
      fireEvent.mouseLeave(draggableWrapper);
      await new Promise(resolve => setTimeout(resolve, 0));
    })
    dropdown = container.querySelector('.dropDown') as Element;
    expect(dropdown).toBeNull();
  });
});

const renderConstantComponent = (props = {}) => {
  return render(<Draggable
    {...props}
    componentId={1}
    onContextMenu={mockOnContextMenuFn}
    contextMenuClick={mockContextMenuClick}
    contextMenu={["1", "2"]}
    />)
};
