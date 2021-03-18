import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';
import { DataNode, DataNodeLoop } from './DataNode';
import { Loop, Variable } from './Classes';

const mockMousedUp = jest.fn()
const mockMousedDown = jest.fn()


describe('The DataNode Component', () => {
  it('renders output correctly', () => {
    const { container } = renderDataNode();
    const nodes = container.querySelectorAll('.node');
    expect(nodes.length).toBe(2); 
  });

  it('stops event propagation on mouseEnter and mouseLeave', async () => {
    const { container } = renderDataNode();
    const nodes = container.querySelectorAll('.node');
    
    await act(async () => {
      fireEvent.mouseOver(nodes[0]);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseOut(nodes[0]);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseDown(nodes[0]);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseUp(nodes[0]);
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    expect(mockMousedDown).toHaveBeenCalled();
    expect(mockMousedUp).toHaveBeenCalled();
  });
});

const renderDataNode = () => {
  return (render(<DataNode 
    position="top"
    nodes={2}
    mousedUp={mockMousedUp}
    mousedDown={mockMousedDown}
    dragInfo={new Variable("Number")}
    />))
}

describe('The Loop DataNode Component', () => {
  it('renders output correctly', () => {
    const { container } = renderLoopDataNode();
    const nodes = container.querySelectorAll('.nodeLoop');
    expect(nodes.length).toBe(2); 
  });

  it('stops event propagation on mouseEnter and mouseLeave', async () => {
    const { container } = renderLoopDataNode();
    const nodes = container.querySelectorAll('.nodeLoop');
    
    await act(async () => {
      fireEvent.mouseOver(nodes[0]);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseOut(nodes[0]);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseDown(nodes[0]);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseUp(nodes[0]);
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    expect(mockMousedDown).toHaveBeenCalled();
    expect(mockMousedUp).toHaveBeenCalled();
  });
});

const renderLoopDataNode = () => {
  return (render(<svg>
    <DataNodeLoop 
    position="top"
    nodes={2}
    mousedUp={mockMousedUp}
    mousedDown={mockMousedDown}
    dragInfo={new Loop()}
    cx={20}
    cy={20}
    />
    </svg>))
}