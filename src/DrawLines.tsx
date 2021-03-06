import React, { FunctionComponent, useState, useEffect, useRef, Fragment } from 'react';
import { createPortal } from 'react-dom';
import styles from './Editor.module.css';
import ddStyles from './Button.module.css'
import { IDataSVGLine, ILoop } from './Interfaces';
import { LoopPrototype } from './Loop';
import classNames from 'classnames';


interface DrawLinesProps {
  canvasInfo: number[],
  children?: any,
  lines:IDataSVGLine[],
  mouseDown: boolean,
  currentLine:IDataSVGLine,
  loops: ILoop[],
  deleteLine(lineId: number): void,
  loopMouseDown(e: React.MouseEvent, nodeInfo: any, index: number): void,
  loopMouseUp(e: React.MouseEvent, nodeInfo: any, index: number): void,
  editLoop(loop: number, key: string, value: any, l: any[]): void,
}

export const DrawLines:FunctionComponent<DrawLinesProps> = ({ canvasInfo, children, lines, mouseDown, currentLine, deleteLine, loops, loopMouseDown, loopMouseUp, editLoop}): JSX.Element => {
  const [rightClicked, setRightClicked] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<number[]>([0,0]);
  const [selectedLine, setSelectedLine] = useState<number>(0);
  // const [bounds, setbounds] = useState<number[]>([0,0]);

  const svgBoxRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let svgBox = svgBoxRef.current;
    if (svgBox) {
        let {left, top} = svgBox.getBoundingClientRect();
        svgBox.setAttribute('viewBox', `${left} ${top} ${20000} ${20000}`);
//        svgBox.setAttribute('viewBox', `${left} ${top} ${svgBox.clientWidth} ${svgBox.clientHeight}`);
        // // add 3 because of the stroke width of rectangle svg
        // setbounds([left + 3, top + 3])
      }
      // the canvasInfo refresh essential for window resize
    }, [canvasInfo])

  const handleRightClick = (event: React.MouseEvent, lineInfo:IDataSVGLine):void => {
    event.preventDefault();
    let svgBox = svgBoxRef.current;
    if (svgBox) {
      let {left, top} = svgBox.getBoundingClientRect();
      setMousePos([event.clientX - left, event.clientY - top]);
      setSelectedLine(lineInfo.id);
    }
      setRightClicked(true)
  }

  const clickOption = (event: React.SyntheticEvent): void => {
    deleteLine(selectedLine);
  }

  return (
    <svg
      className={styles.canvasSvg}
      ref={svgBoxRef}
      viewBox={`0 0 0 0`}
      onClick={() => setRightClicked(false)}
      // style={{width: canvasInfo[1] height: canvasInfo[0]}}>
      style={{width: 20000, height: 20000}}>
      {mouseDown ? <line x1={currentLine.x1} x2={currentLine.x2} y1={currentLine.y1} y2={currentLine.y2} stroke="black"/> : <></>}
      {lines.map((el, i) => (
        <Fragment key={i.toString()}>
          <line
            className={classNames(`bot${el.el1}`, `top${el.el2}`, styles.line)}
            key={i.toString()}
            x1={el.x1}
            x2={el.x2}
            y1={el.y1}
            y2={el.y2}
            onContextMenu={e => handleRightClick(e, el)}
          />
          {rightClicked &&
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
          }
        </Fragment>
      ))}
      {/* {loops.map(el => (
        <LoopPrototype />
      ))} */}
      {loops.map((data: ILoop, i: number) => (
        <LoopPrototype
          key={i.toString()}
          data={data}
          mousedDown={loopMouseDown}
          mousedUp={loopMouseUp}
          edit={editLoop}
          loops={loops}/>
      ))}
      {children}
    </svg>
  )
}
