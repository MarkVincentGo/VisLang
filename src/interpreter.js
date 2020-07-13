
export default function(metaData) {

  // parses all value types and makes copy of meta data
  let workData = parseValueTypes(metaData);

  // if assembled correctly, think of the data passed in as a stack, eventually it will run out
  // this makes it optimal for depth first search

  let mapOfData = new Map();
  for (let data of workData) {
    mapOfData.set(data.id, data);
  };

  let mapOfLines = getMapOfLines(workData);
  let [mapOfLoops, mapOfRefIdToLoopId] = getMapOfLoops(workData);




  let dfsArr = workData.filter(el => el.id < 0);

  let orderOfOperations = [];

  let loopTracker = {};
  for (let [loopId, loop] of mapOfLoops) {
    loopTracker[loopId] = loop.enclosedComponents.size;
  }


  // while still items in dfsArr
  while (dfsArr.length) {
    // pop the top element
    let topEl = dfsArr.pop();

    
    /*********************   LOOP HANDLING   **********************/

    if (mapOfRefIdToLoopId.has(topEl.id)) {
      if (loopTracker[mapOfRefIdToLoopId.get(topEl.id)] === mapOfLoops.get(mapOfRefIdToLoopId.get(topEl.id)).enclosedComponents.size) {
        // orderOfOperations.push(`endLoop${mapOfRefIdToLoopId.get(topEl.id)}`);
        orderOfOperations.push({...mapOfLoops.get(mapOfRefIdToLoopId.get(topEl.id)), term: 'End'});
      }
      orderOfOperations.push(topEl);
      loopTracker[mapOfRefIdToLoopId.get(topEl.id)] -= 1;
      if (loopTracker[mapOfRefIdToLoopId.get(topEl.id)] === 0) {
        // orderOfOperations.push(`startLoop${mapOfRefIdToLoopId.get(topEl.id)}`);
        orderOfOperations.push({...mapOfLoops.get(mapOfRefIdToLoopId.get(topEl.id)), term: 'start'});
      }
      /*^^^^^^^^^^^^^^^^^^   LOOP HANDLING    ^^^^^^^^^^^^^^^^^^^*/

    } else {
      orderOfOperations.push(topEl)
    }


    // iterate metaData for elementid in el2 of lines
    // here need to determine the order according to order in args array
    if (topEl.hasOwnProperty('args')) {
      for (let arg of topEl.args) {
        if (arg) {
          dfsArr.push(mapOfData.get((mapOfLines.get(arg)).el1));
        }
      }
    }
  }
  // once the top of the tree is hit, return, perform more searches
  //the output is an array (Order of Operations) that is logical based on:
  // operation > values (LIKE SICP)
  
  console.log(orderOfOperations)
  return(interpret(orderOfOperations, mapOfData, mapOfLines))

}

function interpret(inputArr = [], inputMap = new Map(), linesMap = new Map(), consoleArr = [], funcStack = [],  scope = new Map(), valueStack = []) {
  // first run, add vars to scope, add funcs to func stack
  for (let node of inputArr) {
    if (node.type === 'End' || node.type === 'Function' || node.type === 'Assign Function' || node.type === 'Reference') {
      funcStack.push(node);
    }
    if (node.type === 'Assign Function' && node.value !== 'REF') {
      scope.set(node.name, node.value)
    }
  }

  console.log(scope)

  // second run, perform the operations, already have initial values in scope
  while (funcStack.length) {
    // debugger
    let topOfFuncStack = funcStack.pop();
    //console.log(topOfFuncStack)
    let args = topOfFuncStack.args;
    if (topOfFuncStack.type === 'Assign Function') {
      // have to reevaluate this in case of a reassign
      scope.set(topOfFuncStack.name, topOfFuncStack.value)
      if (topOfFuncStack.args[0] !== null) {
        // duplicate code, maybe refactor later
        let applyArgs = args.map(id => inputMap.get(linesMap.get(id).el1).value);
        if (topOfFuncStack.value === 'REF') {
          topOfFuncStack.value = topOfFuncStack.func.apply(topOfFuncStack, applyArgs);
          scope.set(topOfFuncStack.name, topOfFuncStack.value)
        } else {
          topOfFuncStack.value = topOfFuncStack.func.apply(topOfFuncStack, applyArgs);
        }
      }
    } else if (topOfFuncStack.type === 'Reference') {
      topOfFuncStack.value = topOfFuncStack.func(scope)
    } else {
      // arguments contain the id's of every node the function depends on
      let applyArgs = args.map(id => inputMap.get(linesMap.get(id).el1).value);
      topOfFuncStack.value = topOfFuncStack.func.apply(topOfFuncStack, applyArgs);
      if (topOfFuncStack.opType === 'Print') {consoleArr.push(topOfFuncStack.value.toString())}
      if (topOfFuncStack.type === 'End') consoleArr.push(`Last Return Value: ${topOfFuncStack.value}`)
    }
  }
  
  return consoleArr
}


function parseValueTypes(inputArr) {
  let output = [];
  for (let node of inputArr) {
    output.push({...node})
  }

  for (let variable of output) {
    if (variable.hasOwnProperty('valueType')) {
      if (variable.value === 'REF') {
        variable.value = 'REF'
      } else {
        if (variable.valueType === 'Number') {
          variable.value = +variable.value;
        } else if (variable.valueType === 'Boolean') {
          variable.value = variable.value === "true" ? true : false;
        } else if (variable.valueType === 'Null') {
          variable.value = null;
        }
      }
    }
  }
  return output;
}

function getMapOfLines(inputArr) {
  let output = new Map();
  for (let node of inputArr) {
    if (node.hasOwnProperty('el1')) {
      output.set(node.id, node)
    }
  }
  return output;
}

function getMapOfLoops(inputArr) {
  let loopMap = new Map();
  let mapOfRefIdToLoopId = new Map();
  for (let node of inputArr) {
    if (node.type === 'Loop') {
      loopMap.set(node.id, node);
      for (let refId of node.enclosedComponents) {
        mapOfRefIdToLoopId.set(refId, node.id)
      }
    }
  }
  return [loopMap, mapOfRefIdToLoopId];
}
