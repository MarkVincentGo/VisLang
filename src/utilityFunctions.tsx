//import _ from 'lodash';
import * as d3 from 'd3';
import * as R from 'ramda';

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

const highlightEnclosedElements = (enclosingEl: Element, callback: (a: number[]) => void): void => {
  let dragCoords: Map<DOMRect, Element> = new Map();
  let dragSibs = enclosingEl.parentElement?.getElementsByClassName('draggable');
  let highlightedArr: number[] = [];
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
        highlightedArr.push(componentInfo.componentId)
      } else {
        tag.style('outline', 'none')
      }
    })
    callback(highlightedArr)
  }
}

// const hEET = _.throttle(highlightEnclosedElements, 300)
export const makeDraggable = (component: Element, posCallback = function(a:any, b:any){}, square: boolean = false, loopCallback = function(a: number[]) {}) => {
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

    let prevArr: number[] = [];
    if (square) {
      return setInterval(() => highlightEnclosedElements(component, (arr: number[]) => {
        if (!R.equals(prevArr, arr)) {
          loopCallback(arr);
        }
        prevArr = [...arr];
      }), 500)
    }
}

export const dragResize = (component: Element, posCallback = function(a:any){}) => {
  let translateX = 0;
  const handleDrag = d3.drag()
    .subject(function() {
      return { x: translateX }
    })
    .on('drag', function() {
      translateX = d3.event.x;
      posCallback(translateX)
    })
    handleDrag(d3.select(component))
}