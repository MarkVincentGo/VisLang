export default function(metaData) {
  const { variables } = metaData;
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
  }
  getVariables(variables);







}