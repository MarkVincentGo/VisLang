import React, { FunctionComponent, useState, useRef } from 'react';
import styles from './Draggable.module.css';
import ddStyles from './Button.module.css'

interface DraggableProps {
  color?: string,
  activeColor?: string,
  borderColor?: string,
  style?: any,
  onContextMenu?(event: React.MouseEvent): any,
  contextMenu?: any[],
  contextMenuClick?(option?: string): any,
  children?: any,
  componentId: number,
}

interface DragInfo {
  currentX: number,
  currentY: number,
  initialX: number,
  initialY: number,
  xOffset:number,
  yOffset:number,
  componentId: number;
}


export const Draggable: FunctionComponent<DraggableProps> = (
  { color = '#D195FF', 
    activeColor = '#B75BFF',
    borderColor = 'blueviolet',
    children,
    style,
    onContextMenu = function(){},
    contextMenuClick = function(){},
    contextMenu = [],
    componentId },
  ) => {

  const [active, setActive] = useState(false);
  const left = useRef(Math.random() * 400 + 100).current;
  const top = useRef(Math.random() * 50 + 50).current;

  let dragInfo: DragInfo = {
    currentX: 0, 
    currentY: 0,
    initialX: 0,
    initialY: 0,
    xOffset: 0,
    yOffset: 0,
    componentId,
  }  

  const mouseIn = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    if (target.tagName !== 'INPUT') {
      setActive(true)
    }
  }

  const mouseOut = (): void => {
    setActive(false)
    setRightClicked(false)
  }

  const clickDropDown = (option?: string): void => {
    setRightClicked(false);
    setActive(false);
    contextMenuClick(option);
  }


  const [rightClicked, setRightClicked] = useState(false);
  return (
    <div 
      className={[styles.variable, active ? styles.active : '', 'draggable', 'element'].join(' ')}
      onMouseOver={mouseIn}
      onMouseLeave={mouseOut}
      style={{
        backgroundColor: color,
        borderColor,
        boxShadow: active ? `0px 0px 5px 1px ${borderColor}` : `0px 0px 6px 1px rgba(0,0,0,.7)`,
        left,
        top,
        zIndex: active ? 200 : 20,
        ...style
      }}
      data-varinfo={JSON.stringify(dragInfo)}
      onContextMenu={e => {onContextMenu(e); setRightClicked(true)}}>
        {children}
        {rightClicked ? 
          <div className={ddStyles.dropDown}>
          {contextMenu.map((option, i) => (
            <div 
              className={ddStyles.dropDownOptionContainer}
              key={i.toString()}
              style={{fontFamily: 'Arial'}}>
                <div 
                  onClick={() => clickDropDown(option)}
                  className={ddStyles.dropDownOption}>
                  {option}
                </div>
            </div>
          ))}
          </div> 
          :
          <></>
        }
    </div>
  )
}