import React, { FunctionComponent, useState } from 'react';
import { InputComponent } from './Variable'
import { Draggable } from './Draggable';
import { IConstantInfo } from './Interfaces';
import { DataNode } from './DataNode';


interface VariableProps {
  data: IConstantInfo,
  edit(constData: IConstantInfo, value?: string): void,
  handleConstantDropDown(option: string, cosntInfo: IConstantInfo): void,
  mousedDown(event: React.MouseEvent, dragInfo: any, index: number): void, 
  mousedUp(event: React.MouseEvent, dragInfo: any, index: number): void
}

export const Constant: FunctionComponent<VariableProps> = (
  { data, edit, handleConstantDropDown, mousedDown, mousedUp }
  ): JSX.Element => {
  const [valName, setValName] = useState('');

  const colorConditions = (type: string) => {
    switch (type) {
      case 'Number':
        return '#90C4FF';
      case 'String':
        return '#90D5FF';
      case 'Boolean':
        return '#90EDFF';
      default:
        break;
    }
  }

  const confirmVarDeclaration = (): void => {
    if (valName.length) {
      edit(data, valName)
    }
  }

  const handleDropDown = (option: string): void => {
    handleConstantDropDown(option, data)
  }
  

  return ( !data.deleted ?
    <Draggable
      color={colorConditions(data.valueType)}
      onContextMenu={e => e.preventDefault()}
      contextMenu={['Delete Constant']}
      contextMenuClick={handleDropDown}
      componentId={data.id}>
      <InputComponent
        onChange={setValName}
        value={valName}
        confirmFn={confirmVarDeclaration}/>
      <br />
      <p style={{margin: '0 auto', fontSize: 8}}>{data.valueType}</p>
        <DataNode
          position="bottom"
          nodes={1}
          mousedDown={mousedDown}
          mousedUp={mousedUp}
          dragInfo={data}/>
    </Draggable>
    :
    <></>
  )
}
