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
      const transform = `translate(${d3.event.x}, ${d3.event.y})`;
      translateX = d3.event.x;
      translateY = d3.event.y;
      callback(translateX, translateY);
      me.attr('transform', transform);
    });
    handleDrag(d3.select(component))
}
