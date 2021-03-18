import React from 'react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { render, fireEvent, act } from '@testing-library/react';
import { Editor } from './Editor';
import * as utilityFunctions from './utilityFunctions';

jest.mock('axios');
const mockInterpret = jest.fn();



describe('The Editor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('renders content correctly as number', async () => {
    const { container } = render(<Editor
      interpret={mockInterpret}
      width={1000}
      />)
    const editorPanel = container.querySelector('.editor');
    expect(editorPanel).not.toBeNull();


    const constantsButton = container.querySelector('.constantsButton');
    expect(constantsButton).not.toBeNull();

    const variablesButton = container.querySelector('.variablesButton');
    expect(variablesButton).not.toBeNull();

    const loopsButton = container.querySelector('.loopsButton');
    expect(loopsButton).not.toBeNull();

    const setOrderButton = container.querySelector('.setOrderButton');
    expect(setOrderButton).not.toBeNull();

    const endButton = container.querySelector('.endButton');
    expect(endButton).not.toBeNull();

    const printButton = container.querySelector('.printButton');
    expect(printButton).not.toBeNull();

    const operationsButton = container.querySelector('.operationsButton');
    expect(operationsButton).not.toBeNull();
  });

  it("Correctly Edits Constant Component", async () => {
    const { container } = await setUpEditorComponent();

    const constant = container.querySelector('.constantContainer') as Element;
    expect(constant).not.toBeNull();

    let input = constant.querySelector('input') as Element;
    expect(input).not.toBeNull();

    await act(async () =>
    {
      fireEvent.click(input);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.change(input, { target: { value: "21" }})
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.keyDown(input, { key: "Enter", code: 13, keyCode: 13 });
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    const editedConstantValue = constant.querySelector('.varConfirmed');
    expect(editedConstantValue?.textContent).toBe('21')
  });

  it("Correctly Deletes Constant Component", async () => {
    const { container } = await setUpEditorComponent();

    let constant = container.querySelector('.constantContainer') as Element;
    expect(constant).not.toBeNull();


    await act(async () =>
    {
      fireEvent.contextMenu(constant);
      await new Promise(resolve => setTimeout(resolve, 0));

      const deleteButton = constant.querySelector('.dropDownOption') as Element;
      fireEvent.click(deleteButton)
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    constant = container.querySelector('.constantContainer') as Element;
    expect(constant).toBeNull()
  });

  it("Correctly Edits Variable Component", async () => {
    const { container } = await setUpEditorComponent();

    const variable = container.querySelector('.variableContainer') as Element;
    expect(variable).not.toBeNull();

    let input = variable.querySelector('input') as Element;
    expect(input).not.toBeNull();

    await act(async () =>
    {
      fireEvent.click(input);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.change(input, { target: { value: "21" }})
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.keyDown(input, { key: "Enter", code: 13, keyCode: 13 });
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    const editedConstantValue = variable.querySelector('.varConfirmed');
    expect(editedConstantValue?.textContent).toBe('21')
  });

  it("Correctly Adds Variable Reference", async () => {
    const { container } = await setUpEditorComponent();

    const variable = container.querySelector('.variableContainer') as Element;
    expect(variable).not.toBeNull();


    await act(async () =>
    {
      fireEvent.contextMenu(variable);
      await new Promise(resolve => setTimeout(resolve, 0));

      const addReferenceButton = variable.querySelector('.dropDownOption') as Element;
      fireEvent.click(addReferenceButton)
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    const variableReference = container.querySelector('.varReferenceContainer') as Element;
    expect(variableReference).not.toBeNull()
  });

  it("Correctly Deletes Variable and its References", async () => {
    const { container } = await setUpEditorComponent();

    let variable = container.querySelector('.variableContainer') as Element;
    expect(variable).not.toBeNull();


    await act(async () =>
    {
      fireEvent.contextMenu(variable);
      await new Promise(resolve => setTimeout(resolve, 0));

      const addReferenceButton = variable.querySelectorAll('.dropDownOption')[0] as Element;
      fireEvent.click(addReferenceButton)
      await new Promise(resolve => setTimeout(resolve, 0));
      
      fireEvent.contextMenu(variable);
      await new Promise(resolve => setTimeout(resolve, 0));


      const deleteButton = variable.querySelectorAll('.dropDownOption')[1] as Element;
      fireEvent.click(deleteButton)
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    variable = container.querySelector('.variableContainer') as Element;
    expect(variable).toBeNull()
  });

  it("Correctly Copies and Deletes Variable Reference", async () => {
    const { container } = await setUpEditorComponent();

    const variable = container.querySelector('.variableContainer') as Element;
    expect(variable).not.toBeNull();


    await act(async () =>
    {
      fireEvent.contextMenu(variable);
      await new Promise(resolve => setTimeout(resolve, 0));

      const addReferenceButton = variable.querySelector('.dropDownOption') as Element;
      fireEvent.click(addReferenceButton)
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    const variableReference = container.querySelector('.varReferenceContainer') as Element;
    expect(variableReference).not.toBeNull();

    await act(async () =>
    {
      fireEvent.contextMenu(variableReference);
      await new Promise(resolve => setTimeout(resolve, 0));

      const addReferenceButton = variableReference.querySelector('.dropDownOption') as Element;
      fireEvent.click(addReferenceButton)
      await new Promise(resolve => setTimeout(resolve, 0));
    })    

    let variableReferences = container.querySelectorAll('.varReferenceContainer');
    expect(variableReferences.length).toBe(2);


    await act(async () =>
    {
      fireEvent.contextMenu(variableReferences[1]);
      await new Promise(resolve => setTimeout(resolve, 0));

      const deleteButton = variableReferences[1].querySelectorAll('.dropDownOption')[1] as Element;
      fireEvent.click(deleteButton)
      await new Promise(resolve => setTimeout(resolve, 0));
    })    

    variableReferences = container.querySelectorAll('.varReferenceContainer');
    expect(variableReferences.length).toBe(1);
  });

  it("Correctly Copies Operator", async () => {
    const { container } = await setUpEditorComponent();

    let operators = container.querySelectorAll('.operatorContainer');
    expect(operators.length).toBe(2);


    await act(async () =>
    {
      fireEvent.contextMenu(operators[0]);
      await new Promise(resolve => setTimeout(resolve, 0));

      const copyOperatorButton = operators[0].querySelectorAll('.dropDownOption')[1] as Element;
      fireEvent.click(copyOperatorButton)
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    operators = container.querySelectorAll('.operatorContainer');
    expect(operators.length).toBe(3)
  });

  it("Correctly Deletes Operator", async () => {
    const { container } = await setUpEditorComponent();

    let operators = container.querySelectorAll('.operatorContainer');
    expect(operators.length).toBe(2);


    await act(async () =>
    {
      fireEvent.contextMenu(operators[0]);
      await new Promise(resolve => setTimeout(resolve, 0));

      const deleteOperatorButton = operators[0].querySelector('.dropDownOption') as Element;
      fireEvent.click(deleteOperatorButton)
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    operators = container.querySelectorAll('.operatorContainer');
    expect(operators.length).toBe(1)
  });

  it("successfully connects two nodes with a line and delete the line", async () => {
    const { container, rerender } = await setUpEditorComponent();

    await act(async () =>
    {
      await new Promise(resolve => setTimeout(resolve, 1000));
    })

    const constant = container.querySelector('.constantContainer') as Element;
    const constantBottomNode = constant.querySelector('.node') as Element;

    const variable = container.querySelector('.variableContainer') as Element;
    const variableTopNode = variable.querySelectorAll('.node')[0];

    const operator = container.querySelector('.operatorContainer') as Element;
    const operatorNodes = operator.querySelectorAll('.node');


    const end = container.querySelector('.endContainer') as Element;
    const endNode = end.querySelector('.node') as Element;

    await act(async () =>
    {
      fireEvent.mouseDown(constantBottomNode);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseMove(constantBottomNode, { clientX: 25, clientY: 25})
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseUp(operatorNodes[0]);
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseDown(constantBottomNode, { clientX: 115, clientY: 115});
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseMove(constantBottomNode, { clientX: -10, clientY: -25})
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseUp(variableTopNode);
      await new Promise(resolve => setTimeout(resolve, 0));     
      
      fireEvent.mouseDown(operatorNodes[2], { clientX: 205, clientY: 135});
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseMove(operatorNodes[2], { clientX: -50, clientY: -55})
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.mouseUp(endNode);
      await new Promise(resolve => setTimeout(resolve, 0));     
    })

    rerender(<Editor
      interpret={mockInterpret}
      width={1000}
      />)
    const canvas = container.querySelector('.canvasSvg') as Element;
    let lines = canvas.querySelectorAll('line');
    expect(lines.length).toBe(3);

    await act(async () =>
    {
      fireEvent.contextMenu(lines[0]);
      await new Promise(resolve => setTimeout(resolve, 0));

      const deleteButton = container.querySelector('.dropDownOption') as Element;
      fireEvent.click(deleteButton);
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    lines = canvas.querySelectorAll('line');
    expect(lines.length).toBe(2);
  })

  it("Correctly clears canvas", async () => {
    const { container } = await setUpEditorComponent();

    const clearButton = container.querySelector('.clearButton') as Element;

    await act(async () =>
    {
      fireEvent.click(clearButton.querySelector('.wrapper') as Element);
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    const draggables = container.querySelectorAll('.variable');
    expect(draggables.length).toBe(0)
  });

  it("Correctly Saves program", async () => {
    jest.spyOn(utilityFunctions, 'getDraggableCoordinates').mockReturnValue({ left: 50, top: 50 });
    (axios as any).post.mockImplementationOnce(() => Promise.resolve({ data: "Success" }))
      .mockImplementationOnce(() => Promise.resolve({ data: "Success"}))
    const { container } = await setUpEditorComponent({ appWrapper: true });

    const saveButton = container.querySelector('.saveButton') as Element;

    await act(async () =>
    {
      fireEvent.click(saveButton.querySelector('.wrapper') as Element);
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    const saveModal = container.querySelector('.saveModal') as Element;
    expect(saveModal).not.toBeNull();

    const modalInput = saveModal.querySelector('input') as Element;
    const modalSaveButton = saveModal.querySelector('.saveButton') as Element;

    await act(async () =>
    {
      fireEvent.change(modalInput, { target: { value: "save" }});
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.click(modalSaveButton.querySelector('.wrapper') as Element);
      await new Promise(resolve => setTimeout(resolve, 0));
      // await new Promise(resolve => setTimeout(resolve, 0));
      // await new Promise(resolve => setTimeout(resolve, 0));
    })
    expect(axios.post).toHaveBeenCalled();
  })

  it("Correctly Loads program", async () => {
    (axios.get as any).mockImplementationOnce(() => Promise.resolve({
      data: {
        Name: 'Something',
        Components: [
        {"id":2861186056951187,"type":"Constant","valueType":"Number","value":"3","deleted":false,"left":428.625,"top":76.25},
        {"id":7955493363807863,"type":"Assign Function","valueType":"Number","name":"z","args":[null],"value":"3","deleted":false,"reassign":false,"left":195.265625,"top":88.953125},
        {"id":4222162842084531,"type":"Function","opType":"+","args":[null,null],"value":0,"deleted":false,"color":"#FCBB5B","left":276.59375,"top":105.859375},
        {"id":2837402616902933,"type":"Function","opType":"-","args":[null,null],"value":0,"deleted":false,"color":"#FCBB5B","left":486.671875,"top":95.703125},
        {"id":2412940987160561,"type":"Function","opType":"mod","args":[null,null],"value":0,"deleted":false,"color":"#FCBB5B","left":158.484375,"top":102.609375},
        {"id":7611885106021269,"type":"Function","opType":"<","args":[null,null],"value":0,"deleted":false,"color":"#FCBB5B","left":238.515625,"top":97.875},
        {"id":230443949789337,"type":"Function","opType":">","args":[null,null],"value":0,"deleted":false,"color":"#FCBB5B","left":488.75,"top":91.0625},
        {"id":7787619524881933,"type":"Function","opType":"*","args":[null,null],"value":0,"deleted":false,"color":"#FCBB5B","left":388.75,"top":59.71875},
        {"id":6307830200617271,"type":"Function","opType":">","args":[null,null],"value":0,"deleted":false,"color":"#FCBB5B","left":102.71875,"top":66},
        {"id":5663222117931411,"type":"Function","opType":"/","args":[null,null],"value":0,"deleted":false,"color":"#FCBB5B","left":451.375,"top":76.328125},
        {"id":2920365683086205,"type":"Function","opType":"==","args":[null,null],"value":0,"deleted":false,"color":"#FCBB5B","left":434.828125,"top":70.703125},
        {"id":8089058082830783,"type":"Function","opType":"Order","args":[null,null,null],"value":0,"deleted":false,"color":"goldenrod","left":458.15625,"top":80.703125},
        {"id":4211579298663153,"type":"Function","opType":"Print","args":[null],"value":0,"deleted":false,"color":"lightgreen","left":392.328125,"top":63.84375},
        {"id":-697,"type":"End","args":[8962306632944015],"value":1,"left":248.9375,"top":270.640625}
      ] }
    }))
    const { container } = await setUpEditorComponent({ appWrapper: true });

    const loadButton = container.querySelector('.loadButton') as Element;

    await act(async () =>
    {
      fireEvent.click(loadButton.querySelector('.wrapper') as Element);
      await new Promise(resolve => setTimeout(resolve, 0));
    })

    const loadModal = container.querySelector('.loadModal') as Element;
    expect(loadModal).not.toBeNull();

    const modalInput = loadModal.querySelector('input') as Element;
    const modalLoadButton = loadModal.querySelector('.loadButton') as Element;

    await act(async () =>
    {
      fireEvent.change(modalInput, { target: { value: "save" }});
      await new Promise(resolve => setTimeout(resolve, 0));

      fireEvent.click(modalLoadButton.querySelector('.wrapper') as Element);
      await new Promise(resolve => setTimeout(resolve, 0));
    })
    expect(axios.get).toHaveBeenCalled();
  })
});


const setUpEditorComponent = async ({ appWrapper = false } = {}) => {
  const { container, rerender } = render(!appWrapper ? <Editor
    interpret={mockInterpret}
    width={1000}
    /> : <div className="App">
     <Editor
    interpret={mockInterpret}
    width={1000}
    /> 
   </div>)

    const renderNodeFromDropDown = async (button: Element) => {
      return act(async () => {
        fireEvent.mouseEnter(button);
        await new Promise(resolve => setTimeout(resolve, 0));
  
        fireEvent.click(button);
        await new Promise(resolve => setTimeout(resolve, 0));
  
        const dropdownOption = button.querySelector('.dropDownOption') as Element;
        fireEvent.click(dropdownOption);
        await new Promise(resolve => setTimeout(resolve, 0));
      });
    }

    const renderNodeNoDropDown = async (button: Element) => {
      return act(async () => {
        fireEvent.mouseEnter(button);
        await new Promise(resolve => setTimeout(resolve, 0));
  
        fireEvent.click(button.querySelector('.wrapper') as Element);
        await new Promise(resolve => setTimeout(resolve, 0));
      })
    }

    const constantsButton = container.querySelector('.constantsButton') as Element;
    const variablesButton = container.querySelector('.variablesButton') as Element;
    const loopsButton = container.querySelector('.loopsButton') as Element;
    const setOrderButton = container.querySelector('.setOrderButton') as Element;
    const endButton = container.querySelector('.endButton') as Element;
    const printButton = container.querySelector('.printButton') as Element;
    const operationsButton = container.querySelector('.operationsButton') as Element;

    await renderNodeFromDropDown(constantsButton);
    await renderNodeFromDropDown(variablesButton);
    await renderNodeFromDropDown(operationsButton);
    await renderNodeFromDropDown(loopsButton);

    await renderNodeNoDropDown(endButton);
    await renderNodeNoDropDown(printButton);
    await renderNodeNoDropDown(setOrderButton);

    

    return { container, rerender }
};
