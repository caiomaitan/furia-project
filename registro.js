import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDvaBKahrzRvll1xseSprZwIiu-HJVXy5U",
  authDomain: "furia-11eb6.firebaseapp.com",
  projectId: "furia-11eb6",
  storageBucket: "furia-11eb6.appspot.com",
  messagingSenderId: "267717144764",
  appId: "1:267717144764:web:4dc38a1e6bf2eec9bee0b9",
  measurementId: "G-G9VRV84WW3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Registro
document.getElementById("formcadastro").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nomeCompleto = document.getElementById("nome").value;
  const nick = document.getElementById("nick").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const csgo = document.getElementById("cs2").checked;
  const lol = document.getElementById("lol").checked;

  const modalidades = [];
  if (csgo) modalidades.push("CS2");
  if (lol) modalidades.push("LoL");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Salvar dados adicionais no Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      nomeCompleto,
      nick,
      email,
      modalidades
    });

    alert("Usuário cadastrado com sucesso!");
    window.location.href = "index.html";
  } catch (error) {
    alert("Erro ao cadastrar: " + error.message);
  }
});
