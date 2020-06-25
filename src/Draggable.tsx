import React, { FunctionComponent, useState } from 'react';
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
  children?: any
}

interface DragInfo {
  currentX: number;
  currentY: number;
  initialX: number;
  initialY: number;
  xOffset:number;
  yOffset:number;
}


export const Draggable: FunctionComponent<DraggableProps> = (
  { color = 'rgba(157, 83, 226, 0.329)', 
    activeColor = 'rgba(157, 83, 226, 0.429)',
    borderColor = 'blueviolet',
    children,
    style,
    onContextMenu = function(){},
    contextMenuClick = function(){},
    contextMenu = [] },
  ) => {
  const [active, setActive] = useState(false);
  let dragInfo: DragInfo = {
    currentX: 0, 
    currentY: 0,
    initialX: 0,
    initialY: 0,
    xOffset: 0,
    yOffset: 0,
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
      className={[styles.variable, active ? styles.active : '', 'draggable'].join(' ')}
      onMouseEnter={mouseIn}
      onMouseLeave={mouseOut}
      style={{
        backgroundColor: active ? activeColor : color,
        borderColor,
        boxShadow: active ? `0px 0px 0px 1px ${borderColor}` : 'none',
        ...style
      }}
      data-varinfo={JSON.stringify(dragInfo)}
      onContextMenu={e => { onContextMenu(e); setRightClicked(true)}}>
        {children}
        {rightClicked ? 
          <div className={ddStyles.dropDown}>
          {contextMenu.map((option, i) => (
            <div className={ddStyles.dropDownOptionContainer} key={i.toString()} style={{fontFamily: 'Arial'}}>
                <div 
                  // REFACTOR
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