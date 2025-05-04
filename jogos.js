// Inicializando o Firebase
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Configuração do Firebase
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
const db = getFirestore(app);
const auth = getAuth();

// Função para buscar dados de um time
async function buscarTime(id) {
  const ref = doc(db, "times", id);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Função para carregar jogos e notícias
async function carregarJogos(modalidades) {
  for (const modalidade of modalidades) {
    const containerJogos = document.getElementById(`jogos-${modalidade}`);
    const containerNoticias = document.getElementById(`noticias-${modalidade}`);
    containerJogos.innerHTML = "";
    containerNoticias.innerHTML = "";

    // Carregar jogos
    const qJogos = query(collection(db, "jogos"), where("modalidade", "==", modalidade.trim()));
    const querySnapshotJogos = await getDocs(qJogos);

    if (querySnapshotJogos.empty) {
      containerJogos.innerHTML = `<p class="text-warning">Nenhum jogo de ${modalidade} encontrado.</p>`;
    } else {
      const jogos = querySnapshotJogos.docs.map(doc => doc.data());
      jogos.sort((a, b) => new Date(a.data) - new Date(b.data));

      for (const jogo of jogos) {
        const furia = await buscarTime(jogo.time_furia);
        const adversario = await buscarTime(jogo.time_adversario);

        const tipo = jogo.tipo === "próximo" ? "👉 Próximo Jogo" : "🔙 Último Jogo";
        const dataFormatada = new Date(jogo.data).toLocaleString("pt-BR");

        const placar = jogo.placar ? jogo.placar.split("-") : null;
        const placarFuria = placar ? placar[0] : "";
        const placarAdversario = placar ? placar[1] : "";

        const cardHTML = `
          <div class="jogo-card-wrapper">
            <div class="card bg-white text-dark shadow mb-4 p-3" style="max-width: 500px; width: 100%;">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-primary">${tipo}</span>
                <small class="text-muted">${jogo.modalidade} - ${jogo.campeonato}</small>
              </div>
              <div class="d-flex align-items-center justify-content-around">
                <div class="text-center">
                  <img src="${furia.logo}" alt="${furia.nome}" style="height: 60px;" />
                  <p class="fw-bold mt-2">${furia.nome}</p>
                </div>
                <div class="text-center mx-2">
                  ${placar ? `<span class="fw-bold" style="font-size: 1.2em;">${placarFuria} x ${placarAdversario}</span>` : ""}
                </div>
                <div class="text-center">
                  <img src="${adversario.logo}" alt="${adversario.nome}" style="height: 60px;" />
                  <p class="fw-bold mt-2">${adversario.nome}</p>
                </div>
              </div>
              <div class="mt-3">
                <p class="text-muted">Data: ${dataFormatada}</p>
                <a href="${jogo.link_stream}" target="_blank" class="btn btn-sm btn-dark">Assistir</a>
              </div>
            </div>
          </div>`;
        containerJogos.innerHTML += cardHTML;
      }
    }

    // Carregar notícias
    const qNoticias = query(collection(db, "noticias"), where("modalidade", "==", modalidade.trim()));
    const querySnapshotNoticias = await getDocs(qNoticias);

    if (querySnapshotNoticias.empty) {
      containerNoticias.innerHTML = `<p class="text-warning">Nenhuma notícia sobre ${modalidade} encontrada.</p>`;
    } else {
      const noticias = querySnapshotNoticias.docs.map(doc => doc.data());

      for (const noticia of noticias) {
        const cardNoticiaHTML = `
          <div class="card bg-light text-dark shadow mb-4 p-3">
            <h5>${noticia.titulo}</h5>
            ${noticia.imagem ? `<img src="${noticia.imagem}" alt="Imagem da notícia" class="img-fluid mb-2" style="max-height: 200px; object-fit: cover;">` : ""}
          </div>`;
        containerNoticias.innerHTML += cardNoticiaHTML;
      }
    }
  }
}

// Função para exibir a modalidade clicada
window.mostrarModalidade = function(modalidade) {
  // Esconde todas as seções de jogos e notícias
  document.getElementById("jogos-LoL").classList.add("d-none");
  document.getElementById("jogos-CS2").classList.add("d-none");
  document.getElementById("noticias-LoL").classList.add("d-none");
  document.getElementById("noticias-CS2").classList.add("d-none");

  // Exibe a seção correspondente à modalidade
  document.getElementById(`jogos-${modalidade}`).classList.remove("d-none");
  document.getElementById(`noticias-${modalidade}`).classList.remove("d-none");
};

// Função para carregar as modalidades preferidas do usuário
async function carregarModalidades() {
  const user = auth.currentUser;
  
  if (user) {
    const userDocRef = doc(db, "usuarios", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const modalidades = userData.modalidades || [];
      
      // Exibe os botões de acordo com as modalidades
      if (modalidades.includes("LoL")) {
        document.getElementById("botao-LoL").classList.remove("d-none");
      }
      if (modalidades.includes("CS2")) {
        document.getElementById("botao-CS2").classList.remove("d-none");
      }

      // Carregar jogos e notícias para as modalidades do usuário
      carregarJogos(modalidades);

      // Exibir o nome do usuário
      document.getElementById("userProfile").innerHTML = `Olá, ${userData.nick || user.displayName}`;
    }
  }
}

// Verifique se o usuário está autenticado e carregar as modalidades
onAuthStateChanged(auth, (user) => {
  if (user) {
    carregarModalidades();
  } else {
    console.log("Usuário não autenticado");
  }
});
