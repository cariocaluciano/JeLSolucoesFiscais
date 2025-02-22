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

  console.log(retorno);

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
    console.log('Saindo')
  });
}

async function CadastraUsuario(usuario, senha, nome, isAdm, modulosLiberados, dataVencimento, valor) {

  var firebaseConfig = CredenciaisFireBase();
  var retorno;
  var retornoDb;

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }


  await firebase.auth().createUserWithEmailAndPassword(usuario, senha)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('usuario cadastrado')
      retorno = 'sucesso'
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Erro ao registrar usuário:", errorCode, errorMessage);
      retorno = 'falha'
    });

  if (retorno == 'sucesso') {
    retornoDb = CadastraUsuario_Db(usuario, nome, isAdm, modulosLiberados, dataVencimento, valor)
  } else {
    retornoDb = 'falha'
  }

  return retornoDb;
}

async function CadastraUsuario_Db(email, nome, isAdm, modulosLiberados, dataVencimento, valor, contato) {
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
    Contato: contato
  };

  usuariosRef.add(novoUsuario)
    .then((docRef) => {
      console.log("Documento adicionado com ID: ", docRef.id);
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