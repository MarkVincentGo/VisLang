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
  const globalScope = getVariables(variables);
  console.log(globalScope)







}