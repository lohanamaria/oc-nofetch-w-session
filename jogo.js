// jogo.js

const NUM_GHOSTFACE = 60;
const TEMPO_INICIAL = 15;
let pontos = 0;
let tempo = 0;
let timer = null;

const nomeJogador = prompt("Qual seu nome?")
document.write("Obrigada por jogar, " + nomeJogador + "!")
localStorage.setItem("nome", nomeJogador)

function iniciaJogo() {
  if (!nomeJogador) {
    nomeJogador = prompt('Digite o seu nome:'); // Solicitar o nome do jogador

    if (!nomeJogador) {
      alert('Nome do jogador não fornecido. O jogo não será iniciado.');
      return;
    }
  }

  pontos = 0;
  tempo = TEMPO_INICIAL;
  let contadorTempo = document.getElementById('tempo');
  contadorTempo.innerText = tempo;

  let tela = document.getElementById('tela');
  tela.innerHTML = '';

  for (let i = 0; i < NUM_GHOSTFACE; ++i) {
    let ghostface = document.createElement('img');
    ghostface.src = 'gt1.jpg';
    ghostface.id = 'm' + i;
    ghostface.onclick = function() {
      pegaGhost(this);
    }
    tela.appendChild(ghostface);
  }

  atualizaPlacar();
  timer = setInterval(contaTempo, 1000);
}

function pegaGhost(ghostface) {
  if (tempo <= 0) return;

  ghostface.onclick = null;
  ghostface.src = 'gt2.jpg';

  ++pontos;
  let contadorPontos = document.getElementById('pontos');
  contadorPontos.innerText = pontos;

  sessionStorage.setItem('pontuacao', pontos);
}

function contaTempo() {
  let contadorTempo = document.getElementById('tempo');
  contadorTempo.innerText = tempo;

  if (tempo <= 0) {
    clearInterval(timer);
    sessionStorage.removeItem('pontuacao');
    alert('Parabéns, '+ nomeJogador + ',' +' você chegou perto de alcançar ele ' + pontos + ' vezes! Pontos para ele, boa sorte na próxima!');
    atualizaPlacar();

    const dataHora = new Date().toLocaleString();

    // Recupera as pontuações do localStorage
    let pontuacoes = JSON.parse(localStorage.getItem('pontuacoes')) || [];

    // Adiciona a nova pontuação ao array de pontuações
    pontuacoes.push({ nome: nomeJogador, pontuacao: pontos, dataHora: dataHora });

    // Ordena as pontuações em ordem decrescente
    pontuacoes.sort(function(a, b) {
      return b.pontuacao - a.pontuacao;
    });

    // Atualiza o localStorage com as pontuações atualizadas
    localStorage.setItem('pontuacoes', JSON.stringify(pontuacoes));

    iniciaJogo();
  } else {
    --tempo;
  }
}

function atualizaPlacar() {
  let placar = document.getElementById('placar');
  let tbody = placar.querySelector('tbody');
  tbody.innerHTML = '';

  // Recupera as pontuações do localStorage
  let pontuacoes = JSON.parse(localStorage.getItem('pontuacoes')) || [];

  // Exibe as melhores pontuações no placar
  for (let i = 0; i < pontuacoes.length; i++) {
    let pontuacao = pontuacoes[i];
    let row = document.createElement('tr');

    let nomeCell = document.createElement('td');
    nomeCell.textContent = pontuacao.nome;
    row.appendChild(nomeCell);

    let pontosCell = document.createElement('td');
    pontosCell.textContent = pontuacao.pontuacao;
    row.appendChild(pontosCell);

    let dataHoraCell = document.createElement('td');
    dataHoraCell.textContent = pontuacao.dataHora;
    row.appendChild(dataHoraCell);

    tbody.appendChild(row);
  }
}

document.getElementById('btn-iniciar').addEventListener('click', iniciaJogo);
