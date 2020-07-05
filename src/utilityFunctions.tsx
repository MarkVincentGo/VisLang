import * as d3 from 'd3';

export const makeDraggable = (component: Element, callback = function(a:any, b:any){}) => {
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
      const transform = `translate(${translateX}, ${translateY})`;
      callback(translateX, translateY);
      me.attr('transform', transform);
    });
    handleDrag(d3.select(component))
}
