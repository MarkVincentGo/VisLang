
export default function(metaData) {

  // parses all value types and makes copy of meta data
  let workData = parseValueTypes(metaData);
  let lines = getLines(metaData)

  // if assembled correctly, think of the data passed in as a stack, eventually it will run out
  // this makes it optimal for depth first search
  let mapOfLines = new Map();
  for (let line of lines) {
    mapOfLines.set(line.id, line)
  }
  console.log(mapOfLines)

  let mapOfData = new Map();
  for (let data of workData) {
    mapOfData.set(data.id, data);
  };


  let dfsArr = workData.filter(el => el.id < 0);

  let orderOfOperations = [];
  // while still items in dfsArr
  while (dfsArr.length) {
    // pop the top element
    let topEl = dfsArr.pop();
    orderOfOperations.push(topEl)
    // iterate metaData for elementid in el2 of lines
    // here need to determine the order according to order in args array
    if (topEl.args) {
      for (let arg of topEl.args) {
        for (let el of workData) {
          if (el.el2 === topEl.id && el.id === arg) {
            // push el1 of those lines to dfsArr
            dfsArr.push(mapOfData.get(el.el1));
          }
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
    debugger
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
      if (topOfFuncStack.opType === 'Console Log') {consoleArr.push(topOfFuncStack.value.toString())}
      if (topOfFuncStack.type === 'End') consoleArr.push(`Last Return Value: ${topOfFuncStack.value}`)
    }
  }
  
  return consoleArr
}

// eslint-disable-next-line

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

function getLines(inputArr) {
  let output = [];
  for (let node of inputArr) {
    if (node.hasOwnProperty('el1')) {
      output.push(node)
    }
  }
  return output;
}