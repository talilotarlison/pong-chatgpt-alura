/**
 * link projeto original alura criado com chat gpt:
 * 
 * https://editor.p5js.org/guilherme.silveira/sketches/htTwrazoZ
 * 
 * 
 * https://editor.p5js.org/guilherme.silveira/sketches/n8jtr1R-g
 * 
 * https://editor.p5js.org/guilherme.silveira/sketches/F40tp3pR7
 * 
 * https://editor.p5js.org/guilherme.silveira/sketches/y6pFBF9L-
 * 
 */




// Variáveis para as raquetes, bola, barras horizontais e contadores de pontos
let raqueteJogador, raqueteComputador, bola, barraSuperior, barraInferior;
let pontosJogador = 0;
let pontosComputador = 0;

function setup() {
  createCanvas(800, 400);
  raqueteJogador = new Raquete(30, height / 2, 10, 60);
  raqueteComputador = new Raquete(width - 40, height / 2, 10, 60);
  bola = new Bola(10);
  barraSuperior = new Barra(0, 0, width, 5);
  barraInferior = new Barra(0, height, width, 5);
  textAlign(CENTER, CENTER);
  textSize(32);
}

function draw() {
  background(0);
 // Desenhar a linha pontilhada branca no centro
  desenharLinhaPontilhada();
  
  // Atualiza as posições das raquetes, bola e barras horizontais
  raqueteJogador.atualizar();
  raqueteComputador.atualizar();
  bola.atualizar(barraSuperior, barraInferior);

  // Verifica colisões entre bola e raquetes
  bola.verificarColisaoRaquete(raqueteJogador);
  bola.verificarColisaoRaquete(raqueteComputador);

  // Desenha as raquetes, a bola, as barras horizontais e os pontos
  raqueteJogador.exibir();
  raqueteComputador.exibir();
  bola.exibir();
  barraSuperior.exibir();
  barraInferior.exibir();
  exibirPontos();
}

function desenharLinhaPontilhada() {
  stroke(255, 255, 255, 120); // Cor branca com opacidade reduzida para efeito ofuscado
  strokeWeight(4); // Espessura da linha
  for (let i = 0; i < height; i += 20) {
    line(width / 2, i, width / 2, i + 10);
  }
}

class Raquete {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  atualizar() {
    if (this === raqueteJogador) {
      this.y = mouseY;
    } else {
      if (bola.y > this.y + this.h / 2) {
        this.y += 3;
      } else if (bola.y < this.y - this.h / 2) {
        this.y -= 3;
      }
    }
    this.y = constrain(this.y, this.h / 2 + barraSuperior.h, height - this.h / 2 - barraInferior.h);
  }

  exibir() {
    fill(color(57, 255, 20)); // Cor verde neon
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Bola {
  constructor(r) {
    this.r = r;
    this.reiniciar();
  }

  aumentarVelocidade() {
    const fatorAumento = 1.1;
    this.velocidadeX *= fatorAumento;
    this.velocidadeY *= fatorAumento;
  }

  reiniciar(vencedor = null) {
    if (vencedor === 'jogador') {
      pontosJogador++;
    } else if (vencedor === 'computador') {
      pontosComputador++;
    }

    this.x = width / 2;
    this.y = height / 2;
    this.velocidadeX = random([-4, -3, 3, 4]);
    this.velocidadeY = random(-3, 3);
  }

  atualizar(barraSuperior, barraInferior) {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;

    if (
      this.y - this.r / 2 <= barraSuperior.y + barraSuperior.h ||
      this.y + this.r / 2 >= barraInferior.y - barraInferior.h
    ) {
      this.velocidadeY *= -1;
    }

    if (this.x + this.r / 2 >= width) {
      this.reiniciar('jogador');
    } else if (this.x - this.r / 2 <= 0) {
      raqueteComputador.y = random(height - raqueteComputador.h);
      this.reiniciar('computador');
    }
  }

  verificarColisaoRaquete(raquete) {
    if (
      this.x - this.r / 2 <= raquete.x + raquete.w / 2 &&
      this.x + this.r / 2 >= raquete.x - raquete.w / 2 &&
      this.y + this.r / 2 >= raquete.y - raquete.h / 2 &&
      this.y - this.r / 2 <= raquete.y + raquete.h / 2
    ) {
      // Inverte a direção horizontal da bola
      this.velocidadeX *= -1;

      // Calcula a posição relativa da bola na raquete (entre -0.5 e 0.5)
      let posicaoRelativa = (this.y - raquete.y) / raquete.h;

      // Define o ângulo da bola após a colisão
      let anguloBola = posicaoRelativa * PI / 3 * 2.3;

      // Atualiza a velocidade vertical da bola com base no ângulo
      this.velocidadeY = this.velocidadeX * Math.tan(anguloBola);

      // Aumenta a velocidade da bola
      this.aumentarVelocidade();
    }
  }

  exibir() {
    fill(color(57, 255, 20)); // Cor verde neon
    ellipseMode(CENTER);
    ellipse(this.x, this.y, this.r);
  }
}

class Barra {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  exibir() {
    fill(color(57, 255, 20)); // Cor verde neon
    rectMode(CENTER);
    rect(this.x + this.w / 2, this.y, this.w, this.h);
  }
}

function exibirPontos() {
  fill(color(255, 255, 255, 120)); // Cor verde neon
  text(`Jogador: ${pontosJogador}`, width / 4, 30);
  text(`Computador: ${pontosComputador}`, (3 * width) / 4, 30);
}
