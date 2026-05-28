let palavraAtual = "";
let dicaAtual = "";
let categoriaAtual = "";
let letrasCorretas = [];
let erros = 0;
let nivel = "facil";

const maxErros = 6;

const icones = {
  "Fruta": "🍎",
  "Animal": "🐶",
  "País": "🌎"
};

const estagiosForca = [
  `\n  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========`,
  `\n  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========`,
  `\n  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========`,
  `\n  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========`,
  `\n  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========`,
  `\n  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========`,
  `\n  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========`
];

/* INICIAR PELO BOTÃO ROXO */
function iniciarJogo() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("jogo").style.display = "flex";
  buscarPalavraAPI();
}

/* SELECIONAR NÍVEL (Inicia o jogo direto no nível escolhido) */
function definirDificuldade(n) {
  nivel = n;
  document.getElementById("inicio").style.display = "none";
  document.getElementById("jogo").style.display = "flex";
  buscarPalavraAPI();
}

/* VOLTAR AO INÍCIO */
function voltarInicio() {
  document.getElementById("inicio").style.display = "flex";
  document.getElementById("jogo").style.display = "none";
}

/* PRÓXIMO JOGO */
function proximoJogo() {
  document.getElementById("btnProximo").style.display = "none";
  buscarPalavraAPI();
}

/* CHAMADA DA API */
async function buscarPalavraAPI() {
  try {
    const resposta = await fetch("http://localhost:3000/palavra");
    const dados = await resposta.json();

    palavraAtual = ajustarDificuldade(dados.palavra).toUpperCase();
    dicaAtual = dados.dica;
    categoriaAtual = dados.categoria;

    letrasCorretas = [];
    erros = 0;

    document.getElementById("resultado").innerText = "";
    document.getElementById("btnProximo").style.display = "none";

    document.getElementById("dica").innerText = "💡 " + dicaAtual + " | " + categoriaAtual;
    document.getElementById("categoriaVisual").innerText = icones[categoriaAtual] || "🌐";

    criarTeclado();
    atualizarTela();
    atualizarDesenhoBoneco();

  } catch (erro) {
    alert("Erro ao conectar com a API. Certifique-se de que rodou 'node server.js' no terminal.");
    voltarInicio();
  }
}

function ajustarDificuldade(palavra) {
  if (nivel === "facil") return palavra.slice(0, 5);
  if (nivel === "medio") return palavra.slice(0, 7);
  return palavra;
}

function criarTeclado() {
  const teclado = document.getElementById("teclado");
  teclado.innerHTML = "";
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let letra of letras) {
    let btn = document.createElement("button");
    btn.innerText = letra;
    btn.onclick = () => verificarLetra(letra, btn);
    teclado.appendChild(btn);
  }
}

function verificarLetra(letra, botao) {
  botao.disabled = true;

  if (palavraAtual.includes(letra)) {
    letrasCorretas.push(letra);
  } else {
    erros++;
    atualizarDesenhoBoneco();
  }

  atualizarTela();
  verificarFim();
}

function atualizarTela() {
  let exibicao = "";
  for (let letra of palavraAtual) {
    exibicao += letrasCorretas.includes(letra) ? letra + " " : "_ ";
  }
  document.getElementById("palavra").innerText = exibicao;
}

function atualizarDesenhoBoneco() {
  const elementoBoneco = document.getElementById("boneco");
  if (elementoBoneco) {
    const indice = erros > maxErros ? maxErros : erros;
    elementoBoneco.textContent = estagiosForca[indice];
  }
}

/* VERIFICAR FIM DO JOGO (Única versão - Corrigida com HTML Estilizado) */
function verificarFim() {
  let venceu = palavraAtual.split("").every(l => letrasCorretas.includes(l));

  if (venceu) {
    salvarRanking("Vitória");
    document.getElementById("resultado").innerHTML = "<span style='color: #2b9e4d;'>🎉 Você venceu!</span>";
    document.getElementById("btnProximo").style.display = "inline-block";
    bloquearTeclado();
  }

  if (erros >= maxErros) {
    salvarRanking("Derrota");
    
    // Injeta a mensagem estilizada de GAME OVER com a resposta correta
    document.getElementById("resultado").innerHTML = `
      <div style="margin-top: 10px;">
        <h2 style="color: #dc3c3c; font-weight: bold; font-size: 32px; letter-spacing: 2px; margin-bottom: 5px;">
          💀 GAME OVER
        </h2>
        <p style="color: #ffffff; font-size: 16px;">
          A palavra era: <strong style="color: #fca104; font-size: 20px;">${palavraAtual}</strong>
        </p>
      </div>
    `;
    
    document.getElementById("btnProximo").style.display = "inline-block";
    bloquearTeclado();
  }
}

function bloquearTeclado() {
  const botoes = document.querySelectorAll("#teclado button");
  botoes.forEach(btn => btn.disabled = true);
}

function salvarRanking(resultado) {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ resultado, palavra: palavraAtual, data: new Date().toLocaleString() });
  localStorage.setItem("ranking", JSON.stringify(ranking));
}

function mostrarRanking() {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  let texto = "🏆 Ranking:\n";
  ranking.slice(-5).forEach(r => {
    texto += `${r.resultado} - ${r.palavra} (${r.data})\n`;
  });
  alert(texto);
}
