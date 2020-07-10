//import _ from 'lodash';
import * as d3 from 'd3';
import React, { useState, useEffect, useRef } from 'react'; 

const isEnclosed = (bounds2: any, bounds1: any) => {
  // top left right
  let left = bounds1.left < bounds2.left + 30;
  let right = bounds1.right > bounds2.right - 30;
  let top = bounds1.top < bounds2.top + 30;
  let bottom = bounds1.bottom > bounds2.bottom - 30;
  if (left && right && top && bottom) {
    return true
  }
  return false
}

const highlightEnclosedElements = (enclosingEl: Element, callback: (a: number) => void) => {
  let dragCoords: Map<DOMRect, Element> = new Map();
  let dragSibs = enclosingEl.parentElement?.getElementsByClassName('draggable');
  if (dragSibs) {
    for (let i = 0; i < dragSibs.length; i++) {
      let sib = dragSibs[i];
      let bounds = sib.getBoundingClientRect();
      dragCoords.set(bounds, sib);
    }
    let meBounds = enclosingEl.getBoundingClientRect()
    dragCoords.forEach((val, key) => {
      let info = val as HTMLElement;
      let tag = d3.select(val);
      if (isEnclosed(key, meBounds)) {
        tag.style('outline', '1px solid black')
        let componentInfo = info.dataset.varinfo ? JSON.parse(info.dataset.varinfo) : '';
        callback(componentInfo.componentId)
      } else {
        tag.style('outline', 'none')
      }
    })
  }
}
// const hEET = _.throttle(highlightEnclosedElements, 300)
export const makeDraggable = (component: Element, posCallback = function(a:any, b:any){}, square: boolean = false, loopCallback = function(a: number) {}) => {
  let translateX = 0;
  let translateY = 0;
  const handleDrag = d3.drag()
    .subject(function() {
      return { x: translateX, y: translateY }
    })
    .on('drag', function() {
      const me = d3.select(this);
      translateX = Math.max(0, d3.event.x);
      translateY = Math.max(0, d3.event.y);
      const transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      posCallback(translateX, translateY);
      me.style('transform', transform);

      // if (square) {
      //   hEET(this, loopCallback)
      // }
    })
    .on('end', function() {

    })
    handleDrag(d3.select(component))
    if (square) {
      return setInterval(() => highlightEnclosedElements(component, loopCallback), 500)
    }
}

export const LoopPrototype = (): JSX.Element => {
  const [circleXPos, setcircleXPos] = useState(0);
  const [circleYPos, setcircleYPos] = useState(0)
  const loopRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let loopEl = loopRef.current
    let circleEl = circleRef.current
    let setIntHighlight: any = null
    if (loopEl && circleEl) {
      setIntHighlight = makeDraggable(loopEl, () => {}, true, (id) => console.log(id));
    }
    if (circleEl) {
      makeDraggable(circleEl, (x: number, y: number) => {
        setcircleXPos(x);
        setcircleYPos(y)
      })
    }
    return (() => {
      clearInterval(setIntHighlight);
    })
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div ref={loopRef} 
        style={{
          backgroundColor: 'rgba(0,0,0,0)',
          width: circleXPos + 100,
          height: circleYPos + 100,
          position: 'absolute',
          border: '6px solid purple',
          }}>
        <div ref={circleRef} 
          style={{
            backgroundColor: 'red',
            borderRadius:'50%',
            width: 20,
            height: 20,
            position: 'absolute',
            bottom: -(16 - circleYPos),
            right: -(16 - circleXPos),
          }}></div>
      </div>
    </>
  )
}