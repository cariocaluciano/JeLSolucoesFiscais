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
  return resultado;
}

async function AtualizaTabela(nomeTabela, campo, valor) {
  var firebaseConfig = CredenciaisFireBase();

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const promisse = Usuario();
  const idUsuario = await ResolvePromisses(promisse, "IdUsuario");

  try {
    const db = await firebase.firestore();
    const RefCollection = await db.collection(nomeTabela);
    const consulta = await RefCollection.where("IdUsuario", "==", idUsuario).get();

    if (!consulta.empty) {
      consulta.forEach(async (doc) => {
        await doc.ref.update({ [campo]: valor });
      });
    } else {
    }

  } catch (error) {
    console.error("Erro ao atualizar:", error);
  }
}

async function getTabela(nomeTabela, campo) {
  var firebaseConfig = CredenciaisFireBase();

  // Inicializa o Firebase apenas se ainda não estiver inicializado
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const promisse = Usuario();
  const idUsuario = await ResolvePromisses(promisse, "IdUsuario");

  try {
    const db = firebase.firestore(); 
    const RefCollection = db.collection(nomeTabela);

    const consulta = await RefCollection.where("IdUsuario", "==", idUsuario).get();

    if (!consulta.empty) {
      let valorCampo = null;

      consulta.forEach((doc) => {
        const dados = doc.data();
        valorCampo = dados[campo]; 
      });

      return valorCampo;

    } else {
      console.log('Nenhum documento encontrado');
      return null;
    }

  } catch (error) {
    console.error("Erro ao buscar dado:", error);
    return null;
  }
}

function chamaLoading() {
  document.getElementById('loadingScreen').style.display = 'flex';
}

function cancelaLoading() {
  document.getElementById('loadingScreen').style.display = 'none';
}
