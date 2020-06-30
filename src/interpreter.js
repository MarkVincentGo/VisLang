
export default function(metaData) {

  // parses all value types and makes copy of meta data
  let workData = parseValueTypes(metaData)

  // if assembled correctly, think of the data passed in as a stack, eventually it will run out
  // this makes it optimal for depth first search
  let mapOfData = new Map();
  for (let data of workData) {
    mapOfData.set(data.id, data);
  };


  let dfsArr = workData.filter(el => el.id < 0);
  console.log(mapOfData)

  let orderOfOperations = [];
  // while still items in dfsArr
  while (dfsArr.length) {
    // pop the top element
    let topEl = dfsArr.pop();
    orderOfOperations.push(topEl)
    // iterate metaData for elementid in el2 of lines
    for (let el of workData) {
      if (el.el2 === topEl.id) {
        // push el1 of those lines to dfsArr
        dfsArr.push(mapOfData.get(el.el1));
      }
    }
  }
  // once the top of the tree is hit, return, perform more searches
  //the output is an array (Order of Operations) that is logical based on:
  // operation > values (LIKE SICP)
  
  console.log(orderOfOperations)
  return interpret(orderOfOperations)
}

function interpret(inputArr = [], funcStack = [], valueStack = [], consoleArr = []) {
  for (let node of inputArr) {
    if (node.type === 'End' || node.type === 'Function') {
      funcStack.push(node);
    } else if (node.type === 'Value') {
      valueStack.push(node);
    }
  }

  while (funcStack.length) {
    let topOfFuncStack = funcStack.pop();
    console.log(topOfFuncStack)
    let args = topOfFuncStack.arguments;
    for (let i = 0; i < args; i++) {
      topOfFuncStack.func = topOfFuncStack.func(valueStack.pop().value);
    }
    topOfFuncStack.value = topOfFuncStack.func;
    if (topOfFuncStack.opType === 'Console Log') {consoleArr.push(topOfFuncStack.value.toString())}
    if (topOfFuncStack.type === 'End' ) consoleArr.push(`Last Return Value: ${topOfFuncStack.value}`)
    topOfFuncStack.type = 'Value';
    valueStack.push(topOfFuncStack);
  }
  return consoleArr
}

function parseValueTypes(inputArr) {
  let output = [];
  for (let node of inputArr) {
    output.push({...node})
  }

  for (let variable of output) {
    if (variable.type === 'Value') {
      if (variable.valueType === 'Number') {
        variable.value = +variable.value;
      } else if (variable.valueType === 'Boolean') {
        variable.value = variable.value === "true" ? true : false;
      } else if (variable.valueType === 'Null') {
        variable.value = null;
      }
    }
  }
  return output
}