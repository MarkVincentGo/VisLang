import * as R from 'ramda';
import * as d3 from 'd3';
import React, { useState, useEffect, useRef } from 'react'; 

const isEnclosed = (bounds2: any, bounds1: any) => {
  // top left right
  let left = bounds1.left < bounds2.left;
  let right = bounds1.right > bounds2.right;
  let top = bounds1.top < bounds2.top;
  let bottom = bounds1.bottom > bounds2.bottom
  if (left && right && top && bottom) {
    return true
  }
  return false
}

export const makeDraggable = (component: Element, callback = function(a:any, b:any){}, square: boolean = false) => {
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
      callback(translateX, translateY);
      me.style('transform', transform);

      if (square) {
        //const dad = d3.select(this.parentElement)
        // returns an array of all draggable siblings
        let dragCoords: Map<DOMRect, Element> = new Map();
        let dragSibs = this.parentElement?.getElementsByClassName('draggable');
        if (dragSibs) {
          for (let i = 0; i < dragSibs.length; i++) {
            let sib = dragSibs[i];
            let bounds = sib.getBoundingClientRect();
            dragCoords.set(bounds, sib);
          }
          let meBounds = this.getBoundingClientRect()
          dragCoords.forEach((val, key) => {
            let tag = d3.select(val);
            let originalColor = tag.style('background-color');
            if (isEnclosed(key, meBounds)) {
              tag.style('background-color', 'red')
            } else {
              tag.style('background-color', originalColor)
            }
          })
        }
      }
    })
    .on('end', function() {
 
    })
    handleDrag(d3.select(component))
}

export const LoopPrototype = (): JSX.Element => {
  const [circleXPos, setcircleXPos] = useState(0);
  const [circleYPos, setcircleYPos] = useState(0)
  const loopRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let loopEl = loopRef.current
    let circleEl = circleRef.current
    if (loopEl && circleEl) {
      makeDraggable(loopEl, () => {}, true);
    }
    if (circleEl) {
      makeDraggable(circleEl, (x: number, y: number) => {
        setcircleXPos(x);
        setcircleYPos(y)
      })
    }
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
          border: '6px solid purple'}}>
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