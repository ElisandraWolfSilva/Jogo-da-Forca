const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const palavras = [];

// GERAR 500 PALAVRAS AUTOMATICAMENTE
const frutas = ["BANANA","MAÇA","MORANGO","ABACAXI","LARANJA","MANGA","UVA","PERA","MELANCIA","KIWI"];
const animais = ["CACHORRO","GATO","ELEFANTE","LEAO","TIGRE","ZEBRA","GIRAFA","URSO","MACACO","COELHO"];
const paises = ["BRASIL","ARGENTINA","CANADA","FRANCA","ALEMANHA","ITALIA","JAPAO","CHINA","MEXICO","PORTUGAL"];

function gerarLista(listaBase, categoria) {
  for (let i = 0; i < 50; i++) {
    listaBase.forEach(item => {
      palavras.push({
        palavra: item,
        dica: `Pertence à categoria ${categoria}`,
        categoria: categoria
      });
    });
  }
}

gerarLista(frutas, "Fruta");
gerarLista(animais, "Animal");
gerarLista(paises, "País");

module.exports = palavras;

// Rota principal
app.get("/palavra", (req, res) => {
  const random = palavras[Math.floor(Math.random() * palavras.length)];
  res.json(random);
});

// Porta
app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
});
