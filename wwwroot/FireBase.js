function CredenciaisFireBase() {
  var firebaseConfig = {
    apiKey: "AIzaSyA07tvYAtRynshin5Hci1hdepfzjZLZFlQ",
    authDomain: "solufiscal-52276.firebaseapp.com",
    projectId: "solufiscal-52276",
    storageBucket: "solufiscal-52276.firebasestorage.app",
    messagingSenderId: "806066956386",
    appId: "1:806066956386:web:bdd4d3b2c81d8fd3bc093b",
    measurementId: "G-KY7CWZ105G"
  };

  return firebaseConfig;
}

async function VerificaLogin() {

  var firebaseConfig = CredenciaisFireBase();

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();

  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        resolve("usuario não logado");
      } else {
        resolve("usuario logado");
      }
    });
  });
}

async function Login(usuario, senha) {

  var firebaseConfig = CredenciaisFireBase();
  var retorno;

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  await firebase.auth().signInWithEmailAndPassword(usuario, senha)
    .then((userCredential) => {
      var user = userCredential.user;
      retorno = 'sucesso'
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      retorno = 'falha'
    });
  return retorno;

}

async function Sair() {
  var firebaseConfig = CredenciaisFireBase();
  var retorno;

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();


  auth.signOut().then(() => {
  });
}

async function CadastraUsuario(usuario, senha, nome, isAdm, modulosLiberados, dataVencimento, valor, contato) {
  var idUsuario;
  var firebaseConfig = CredenciaisFireBase();
  var retorno;
  var retornoDb;
  var cadEmpresa = 'null'

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  await firebase.auth().createUserWithEmailAndPassword(usuario, senha)
    .then((userCredential) => {
      const user = userCredential.user;
      idUsuario = user.uid;
      retorno = 'sucesso'
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      retorno = 'falha'
    });

  if (retorno == 'sucesso') {
    retornoDb = CadastraUsuario_Db(usuario, nome, isAdm, modulosLiberados, dataVencimento, valor, contato, idUsuario, cadEmpresa)
  } else {
    retornoDb = 'falha'
  }

  return retornoDb;
}

async function CadastraUsuario_Db(email, nome, isAdm, modulosLiberados, dataVencimento, valor, contato, idUsuario, cadEmpresa) {
  var firebaseConfig = CredenciaisFireBase();
  var retorno;

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.firestore();

  const usuariosRef = db.collection("Usuarios");

  const novoUsuario = {
    Datavencimento: dataVencimento,
    Email: email,
    IsAdm: isAdm,
    ModulosLiberados: modulosLiberados,
    Nome: nome,
    Valor: valor,
    Contato: contato || 'null' ,
    IdUsuario: idUsuario,
    CadEmpresa: cadEmpresa
  };

  usuariosRef.add(novoUsuario)
    .then((docRef) => {
      retorno = 'sucesso'
    })
    .catch((error) => {
      console.error("Erro ao adicionar o documento: ", error);
      retorno = 'falha'
    });

  return retorno;
}

async function Usuarios() {
  var firebaseConfig = CredenciaisFireBase();

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  return new Promise((resolve, reject) => {
    const db = firebase.firestore();
    db.collection("Usuarios")
      .get()
      .then((snapshot) => {
        let usuarios = [];
        snapshot.forEach((doc) => {
          usuarios.push({ id: doc.id, ...doc.data() });
        });

        resolve(JSON.stringify(usuarios)); // Transforma em JSON antes de enviar
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function Usuario() {
  var firebaseConfig = CredenciaisFireBase();

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  return new Promise((resolve, reject) => {
    const user = firebase.auth().currentUser;

    if (!user) {
     // reject("Nenhum usuário autenticado.");
      return;
    }

    const db = firebase.firestore();
    db.collection("Usuarios")
      .where("IdUsuario", "==", user.uid) // Filtra pelo ID do usuário autenticado
      .get()
      .then((snapshot) => {
        let usuarios = [];
        snapshot.forEach((doc) => {
          usuarios.push({ id: doc.id, ...doc.data() });
        });

        resolve(JSON.stringify(usuarios)); // Retorna os dados do usuário autenticado
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function CadastraEmpresaPorUsuario(razSoc, cnpj) {
  var firebaseConfig = CredenciaisFireBase();

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const user = firebase.auth().currentUser;

  if (!user) {
    return Promise.reject("Usuário não autenticado.");
  }

  const db = firebase.firestore();
  const CadEmpresaRef = db.collection("CadEmpresas_Usuarios");

  const novaEmpresa = {
    Cnpj: cnpj,
    Id_Usuario: user.uid, // Corrigido de user.id para user.uid
    RazSoc: razSoc
  };

  try {
    const docRef = await CadEmpresaRef.add(novaEmpresa);
    return "sucesso";
  } catch (error) {
    console.error("Erro ao adicionar o documento: ", error);
    return "falha";
  }
}

async function ExibeEmpresasPorUsuario() {
  var firebaseConfig = CredenciaisFireBase();

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  return new Promise(async (resolve, reject) => {
    var user = await firebase.auth().currentUser;

    if (!user) {
      await new Promise((res) => {
        firebase.auth().onAuthStateChanged((u) => {
          if (u) {
            user = u;
            res();
          }
        });
      });
    }

    if (!user) {
      reject("Nenhum usuário autenticado.");
      return;
    }
    console.log(user)
    const db = firebase.firestore();

    try {
      const snapshot = await db.collection("CadEmpresas_Usuarios")
        .where("Id_Usuario", "==", user.uid)
        .get();
      let empresas = [];

      if (snapshot.empty) {
        resolve([]); // Retorna um array vazio ao invés de um erro
        return;
      }

      // Percorre TODOS os documentos retornados
      snapshot.forEach((doc) => {
        empresas.push({ id: doc.id, ...doc.data() });
      });
      console.log(empresas)
      resolve(empresas); // Retorna um array de objetos JSON

    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      reject(error);
    }
  });
}



