import React, { FunctionComponent, useState } from 'react';
import styles from './Button.module.css';

interface ButtonContainerProps {
  children?: any,
}

export const ButtonContainer: FunctionComponent<ButtonContainerProps> = (
  { children }
  ): JSX.Element => (
  <div className={styles.container}>
    {children}
  </div>
)


interface ButtonProps {
  name: string,
  color? : string,
  backgroundColor?: string,
  hoverColor?: string,
  dropDown?: boolean,
  dropDownList?: string[];
  onClick?(): void;
  ddClick?(): void;
}

export const Button: FunctionComponent<ButtonProps> = (
  { name,
    color = '#777',
    backgroundColor = 'white',
    hoverColor  = 'white',
    onClick = function(){},
    ddClick = function(){},
    dropDown = false,
    dropDownList = [],
  }
  ): JSX.Element => {
  const [outerHover, setOuterHover] = useState(false)
  let width = name.length * 8;

  const mouseEnter = (event: any): void => {
    let target = event.currentTarget;
    target.style.backgroundColor = hoverColor
    setOuterHover(true)
  }
  const mouseLeave = (event: any): void => {
    let target = event.currentTarget
    target.style.backgroundColor = backgroundColor;
    setOuterHover(false)
  }

  const clickDropDown = (event: any): void => {
    ddClick();
    setOuterHover(false)
  }

  return (
    <div 
      style={{position: 'relative'}}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}>
      <div
        className={styles.wrapper}
        onClick={onClick}
        style={{color: outerHover ? 'black' : color, backgroundColor}}>
        {name}
        <svg height="3" width={width}>
          <line
            className={[styles.underline, outerHover ? styles.hovered : ''].join(' ')}
            x1={Math.floor(width)/2 - 1}
            y1="0"
            x2={Math.floor(width)/2 + 1}
            y2="0"
            stroke="black"
            strokeWidth="2"/>
        </svg>
      </div>
      {(dropDown && outerHover && dropDownList.length) ? 
        <div className={styles.dropDown}>
          {dropDownList.map((option, i) => (
            <div className={styles.dropDownOptionContainer} key={i.toString()}>
                <div 
                  onClick={clickDropDown}
                  className={styles.dropDownOption}>
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
