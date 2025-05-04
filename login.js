import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDvaBKahrzRvll1xseSprZwIiu-HJVXy5U",
  authDomain: "furia-11eb6.firebaseapp.com",
  projectId: "furia-11eb6",
  storageBucket: "furia-11eb6.appspot.com",
  messagingSenderId: "267717144764",
  appId: "1:267717144764:web:4dc38a1e6bf2eec9bee0b9",
  measurementId: "G-G9VRV84WW3"
};

// Inicialização Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// Função para recuperar as modalidades do usuário
async function getUserModalities(userId) {
  const userDoc = await getDoc(doc(db, "usuarios", userId));
  if (userDoc.exists()) {
    return userDoc.data().modalidades; // retorna um array de modalidades
  } else {
    return [];
  }
}

// Login
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("username").value;  // Corrigir para 'username'
  const password = document.getElementById("password").value;  // Corrigir para 'password'

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Recuperar as modalidades do usuário
    const modalidades = await getUserModalities(user.uid);

    // Mostrar as modalidades no front-end
    mostrarModalidades(modalidades);

    alert("Login realizado com sucesso!");
    window.location.href = "furia.html"; // Redirecionar após o login
  } catch (error) {
    alert("Erro ao fazer login: " + error.message);
  }
});

// Função para exibir os botões das modalidades no front-end
function mostrarModalidades(modalidades) {
  // Escondendo todos os botões
  const botaoLoL = document.querySelector(".botao-modalidade[data-mod='LoL']");
  const botaoCS2 = document.querySelector(".botao-modalidade[data-mod='CS2']");

  // Exibindo os botões de acordo com as modalidades do usuário
  if (botaoLoL) {
    if (modalidades.includes("LoL")) {
      botaoLoL.classList.remove("d-none");
    } else {
      botaoLoL.classList.add("d-none");
    }
  }

  if (botaoCS2) {
    if (modalidades.includes("CS2")) {
      botaoCS2.classList.remove("d-none");
    } else {
      botaoCS2.classList.add("d-none");
    }
  }
}
