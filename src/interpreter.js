export default function(metaData) {
  const { variables } = metaData;
  /* LOOP through variable dictionaries and store them in a scope variable
    with the scope variable being the global scope by default */
  function getVariables(variables, scope = {}) {
    for (let variable of variables) {
      if (variable.type === 'Number') {
        variable.value = +variable.value;
      } else if (variable.type === 'Boolean') {
        variable.value = variable.value === "true" ? true : false;
      } else if (variable.type === 'Null') {
        variable.value = null;
      }
      scope = {...scope, [variable.name]: variable}
    }
    console.log(scope)
    return scope
  }
  // const globalScope = getVariables(variables);
  // console.log(globalScope)

  // if assembled correctly, think of the data passed in as a stack, eventually it will run out
  // this makes it optimal for depth first search
  let mapOfData = new Map();
  for (let data of metaData) {
    mapOfData.set(data.id, data);
  };


  let dfsArr = metaData.filter(el => el.id < 0);
  console.log(mapOfData)

  let orderOfOperations = [];
  // while still items in dfsArr
  while (dfsArr.length) {
    // pop the top element
    let topEl = dfsArr.pop();
    orderOfOperations.push(topEl)
    // iterate metaData for elementid in el2 of lines
    for (let el of metaData) {
      if (el.el2 === topEl.id) {
        // push el1 of those lines to dfsArr
        dfsArr.push(mapOfData.get(el.el1));
      }
    }
  }
  // once the top of the tree is hit, return, perform more searches, and then perform
  // operations when going up the tree
  
  console.log(orderOfOperations)


}