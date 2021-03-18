import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, act, screen } from '@testing-library/react';
import { Canvas } from './EditorCanvas';
import { Constant } from './Classes';



describe("The drag and drop functionality", () => {
  it("can move a node from one part of the screen to another", async () => {
    const { container } = await setUpEditorComponent();

    await act(async () =>
    {
      document.body.style.width = "1024px";
      document.body.style.height = "800px";
      await new Promise(resolve => setTimeout(resolve, 1000));
    })

    let constant = container.querySelector(".constantContainer") as Element;


    await act(async () =>
    {
      fireEvent.mouseDown(constant);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseMove(constant, { clientX: 25, clientY: 25})
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseUp(constant);
      await new Promise(resolve => setTimeout(resolve, 0)); 
    })

    // some assertion to indicate a change in position. Currently blocked on how to show DOM coordinates in Jest.

  })
});

const mockEditConstant = jest.fn();


const setUpEditorComponent = async ({ appWrapper = false } = {}) => {
  const { container, rerender } = render(<Canvas
    constantArray={[new Constant("Number")]}
    variableArray={[]}
    referenceArray={[]}
    operationsArray={[]}
    linesArray={[]}
    loopsArray={[]}
    endsArray={[]}
    updateLines={jest.fn()}
    editConstant={mockEditConstant}
    editVariable={jest.fn()}
    editFunction={jest.fn()}
    editLoop={jest.fn()}
    handleConstantDropDown={jest.fn()}
    handleVariableDropDown={jest.fn()}
    handleReferenceDropDown={jest.fn()}
    handleOperatorDropDown={jest.fn()}
    pressPlay={jest.fn()}
    pressSave={jest.fn()}
    pressClear={jest.fn()}
    pressLoad={jest.fn()}
    />)

    return { container, rerender }
};
