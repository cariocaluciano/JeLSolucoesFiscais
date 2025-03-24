async function ResolvePromisses(promisse, campo) {
  const resultado = await promisse;  
  const dados = JSON.parse(resultado);
  return dados[0][campo]; 
}

async function UsuarioAdm() {
  const promisse = Usuario();
  const resultado = await ResolvePromisses(promisse, "IsAdm");
  return resultado
}

async function ModulosLiberados() {
  const promisse = Usuario();
  const resultado = await ResolvePromisses(promisse, "ModulosLiberados");
  console.log(resultado);
  return resultado;
}