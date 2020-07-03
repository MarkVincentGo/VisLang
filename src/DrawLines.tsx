import React, { FunctionComponent, useState, useEffect, useRef, Fragment } from 'react';
import { createPortal } from 'react-dom';
import styles from './Editor.module.css';
import ddStyles from './Button.module.css'
import { DataSVGLine } from './Editor';
import { makeDraggable } from './utilityFunctions';

interface CircleProps {
  updateCirclePos(xPos: number, yPos: number): void
}
const Circle: FunctionComponent<CircleProps> = ({ updateCirclePos }): JSX.Element => {
  const circleRef = useRef<SVGCircleElement>(null)
  useEffect(() => {
    let circleEl = circleRef.current
    if (circleEl) {
      makeDraggable(circleEl, updateCirclePos)
    }
  }, [])

  return <circle ref={circleRef} cx="175" cy="175" r="4" strokeWidth="1" stroke="black" fill="red" />
}

interface DrawLinesProps {
  canvasInfo: number[],
  children?: any,
  lines: DataSVGLine[],
  mouseDown: boolean,
  currentLine: DataSVGLine,
  deleteLine(lineId: number): void,
}

export const DrawLines:FunctionComponent<DrawLinesProps> = ({ canvasInfo, children, lines, mouseDown, currentLine, deleteLine}): JSX.Element => {
  const [rightClicked, setRightClicked] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<number[]>([0,0]);
  const [selectedLine, setSelectedLine] = useState<number>(0)
  const svgBox = useRef<any>(<div></div>);

  useEffect(() => {
    let {left, top} = svgBox.current.getBoundingClientRect();
    svgBox.current.setAttribute('viewBox', `${left} ${top} ${canvasInfo[1]} ${canvasInfo[0]}`);
  }, [canvasInfo])

  const handleRightClick = (event: React.MouseEvent, lineInfo: DataSVGLine):void => {
    event.preventDefault();
    let {left, top} = svgBox.current.getBoundingClientRect();
    setMousePos([event.clientX - left, event.clientY - top]);
    setSelectedLine(lineInfo.id);
    setRightClicked(true)
  }

  const clickOption = (event: React.SyntheticEvent): void => {
    deleteLine(selectedLine);
  }
  const [xPos, setxPos] = useState<number>(0);
  const [yPos, setyPos] = useState<number>(0);
  const updateCirclePos = (xPos: number, yPos: number):void => {
    setxPos(xPos);
    setyPos(yPos);
  }

  return (
    <svg
      ref={svgBox}
      viewBox={`0 0 ${canvasInfo[1]} ${canvasInfo[0]}`}
      onClick={() => setRightClicked(false)}
      style={{width: canvasInfo[1], height: canvasInfo[0]}}>
      {mouseDown ? <line x1={currentLine.x1} x2={currentLine.x2} y1={currentLine.y1} y2={currentLine.y2} stroke="black"/> : <></>}
      {lines.map((el, i) => (
        <Fragment key={i.toString()}>
          <line
            key={i.toString()}
            x1={el.x1}
            x2={el.x2}
            y1={el.y1}
            y2={el.y2}
            className={styles.line}
            onContextMenu={e => handleRightClick(e, el)}
          />
          {rightClicked ?
            createPortal((
              <div className={ddStyles.dropDown} style={{top: mousePos[1], left: mousePos[0]}}>
                <div className={ddStyles.dropDownOptionContainer}>
                  <div 
                    className={ddStyles.dropDownOption}
                    onClick={clickOption}>
                    Delete Line
                  </div>
                </div>
              </div>
            ), document.getElementsByClassName(styles.canvas)[0])
            :
            <></>
          }
        </Fragment>
      ))}
      <>
        <rect
          onClick={() => console.log('rectclicked')}
          x="150" rx="3"
          y="150" ry="3"
          width={Math.max(xPos + 20, 20)}
          height={Math.max(yPos + 20, 20)}
          strokeWidth="2"
          style={{fill: 'none', strokeWidth: 6, stroke: 'black', cursor: 'pointer'}}/>
        <Circle updateCirclePos={updateCirclePos}/>
      </>
      {children}
    </svg>
  )
}
