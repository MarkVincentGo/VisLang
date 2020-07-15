
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
        orderOfOperations.push({...mapOfLoops.get(mapOfRefIdToLoopId.get(topEl.id)), term: 'Start'});
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
  return(interpret(orderOfOperations, mapOfData, mapOfLines, mapOfLoops))

}

function interpret(inputArr = [], inputMap = new Map(), linesMap = new Map(), loopMap = new Map(), consoleArr = [], funcStack = [],  scope = new Map()) {
  // first run, add vars to scope, add funcs to func stack
  for (let node of inputArr) {

    if (node.type === 'Loop' && node.term === 'End') {
      scope.set(`Loop${node.id}`, []);
      scope.set(`LogLoop${node.id}`, true);
      scope.set(`LoopCount${node.id}`, (node.args[0])? inputMap.get(linesMap.get(node.args[0]).el1).value : 1)
    }

    if (node.type === 'Loop' && node.term === 'Start') {
      scope.set(`LogLoop${node.id}`, false)
    }

    if (['End', 'Function', 'Reference', 'Assign Function', 'Loop'].includes(node.type)) {
      funcStack.push(node);
      for (let [loopId] of loopMap) {
        if (scope.get(`LogLoop${loopId}`) === true && node.type !== 'Loop') {
          let arr = scope.get(`Loop${loopId}`);
          arr.push(node);
          scope.set(`Loop${loopId}`, arr);
        }
      }
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

    /* ASSIGN FUNCTION */
    if (topOfFuncStack.type === 'Assign Function') {
      // have to reevaluate this in case of a reassign
      scope.set(topOfFuncStack.name, topOfFuncStack.value)
      if (topOfFuncStack.args[0] !== null) {
        // duplicate code, maybe refactor later
        let applyArgs = args.map(id => inputMap.get(linesMap.get(id).el1).value);
        if (topOfFuncStack.reassign === true) {
          topOfFuncStack.value = topOfFuncStack.func.apply(topOfFuncStack, applyArgs);
          scope.set(topOfFuncStack.name, topOfFuncStack.value)
        } else {
          topOfFuncStack.value = scope.get(topOfFuncStack.name)
        }
      }
    
    /* REFERENCE */
    } else if (topOfFuncStack.type === 'Reference') {
      topOfFuncStack.value = topOfFuncStack.func(scope)
    /* LOOPS */
    } else if (topOfFuncStack.type === 'Loop') {
      if (topOfFuncStack.term === 'End') {
        if (scope.get(`LoopCount${topOfFuncStack.id}`) > 1) {
          funcStack = [...funcStack,topOfFuncStack];
          funcStack = funcStack.concat(scope.get(`Loop${topOfFuncStack.id}`));
          let countsLeft = scope.get(`LoopCount${topOfFuncStack.id}`);
          countsLeft -= 1;
          scope.set(`LoopCount${topOfFuncStack.id}`, countsLeft);
        } 
      } else if (topOfFuncStack.term === 'Start') {
        continue
      }
        
    /* EVERYTHING ELSE */
    } else {
      // arguments contain the id's of every node the function depends on
      let applyArgs = args.map(id => {
        let idVar = linesMap.get(id).el1;
        if (scope.get(inputMap.get(idVar).name)) {
          return scope.get(inputMap.get(idVar).name)
        } else {
          return inputMap.get(linesMap.get(id).el1).value
        }
      });
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
