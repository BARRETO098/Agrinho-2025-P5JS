let animals = [];
let truck = {
  x: 100,
  y: 310,
  speed: 2,
  direction: 0,
  carrying: [],
  carryingDepositX: 250,
  carryingDepositY: 270,
  lossPercentage: 0.2, // 20% de perda
};
let score = 0;
let money = 0;
let soundsToDisplay = [];
let lastAnimalTime = 0;
let animalInterval = 1500; // Diminuiu para 1.5 segundos
let cameraX = 0;
let animalTypes = [
  { emoji: "🐄", sound: "Muuu!", price: 20 },
  { emoji: "🐖", sound: "Oinc!", price: 15 },
  { emoji: "🐑", sound: "Mééé!", price: 10 },
  { emoji: "🐐", sound: "Bééé!", price: 12 },
  { emoji: "🐔", sound: "Cocoricó!", price: 5 },
  { emoji: "🐇", sound: "Prupru!", price: 8 },
  { emoji: "🐓", sound: "Cocó!", price: 6 },
  { emoji: "🦃", sound: "Gluglu!", price: 10 },
  { emoji: "🐴", sound: "Rinchinchar!", price: 25 },
];

let gameStartTime;
let gameDuration = 120000; // 2 minutos em milissegundos
let gameEnded = false;
let resetButton;

// Sons
let moneySound;
let timeSound;

function setup() {
  createCanvas(900, 400);
  textSize(40);
  resetGame(); // Inicializa o jogo
  resetButton = createButton("Recomeçar");
  resetButton.position(width / 2 - 50, height - 40);
  resetButton.mousePressed(resetGame);

  // Carrega os sons
  moneySound = loadSound('money.mp3');  // Certifique-se de ter o arquivo "money.mp3" no seu diretório
  timeSound = loadSound('time.mp3');    // Certifique-se de ter o arquivo "time.mp3" no seu diretório
}

function resetGame() {
  animals = [];
  truck = { ...truck, x: 100, carrying: [], direction: 0 };
  score = 0;
  money = 0;
  soundsToDisplay = [];
  for (let i = 0; i < 3; i++) addRandomAnimal(I);{
    
  }
  lastAnimalTime = millis();
  gameStartTime = millis();
  gameEnded = false;
}

function draw() {
  background(135, 206, 235);
  cameraX = truck.x - width / 2 + 60;
  push();
  translate(-cameraX, 0);
  drawBiggerCity(); // Desenha a cidade maior
  drawRoad();
  drawFarm();
  drawCarryingDeposit(); // Desenha a área de depósito
  updateTruck();
  drawTruck(truck.x, truck.y);
  updateAnimals();
  drawAnimals();
  drawSounds();
  pop();

  // Interface fixa
  fill(0);
  textSize(20);
  textAlign(LEFT);

  if (!gameEnded) {
    const timeLeft = gameDuration - (millis() - gameStartTime);
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    text(`Tempo: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`, 10, 20);
    text("Pontos: " + score, 10, 45);
    text("No caminhão: " + truck.carrying.length, 10, 70);
    text("Dinheiro: R$ " + money.toFixed(2), 10, 95);

    // Tocar o som de tempo após cada 10 segundos
    if (millis() - gameStartTime > 10000 * Math.floor((millis() - gameStartTime) / 10000) && !timeSound.isPlaying()) {
      timeSound.play();  // Toca o som de tempo
    }

  } else {
    textSize(30);
    textAlign(CENTER);
    text("Tempo Esgotado!", width / 2, height / 2 - 30);
    text(`Dinheiro Final: R$ ${money.toFixed(2)}`, width / 2, height / 2 + 10);
    textAlign(LEFT);
  }

  // Lista de preços na parte superior direita
  fill(0);
  textSize(14);
  textAlign(RIGHT, TOP);
  let yOffset = 10;
  text(
    "Preços (venda com " + truck.lossPercentage * 100 + "% de perda):",
    width - 10,
    yOffset
  );
  yOffset += 15;
  for (let type of animalTypes) {
    const sellPrice = type.price * (1 - truck.lossPercentage);
    text(`${type.emoji}: R$${sellPrice.toFixed(2)}`, width - 10, yOffset);
    yOffset += 15;
  }

  if (!gameEnded) {
    // Instruções de como jogar (um pouco mais abaixo agora)
    textSize(16);
    textAlign(LEFT, BOTTOM);
    text("COMO JOGAR:", 10, height - 65);
    text("←/→ para mover, clique nos animais.", 10, height - 50);
    text("Leve ao Depósito para vender.", 10, height - 35);

    if (millis() - lastAnimalTime > animalInterval) {
      addRandomAnimal();
      lastAnimalTime = millis();
    }

    // Verifica se o tempo acabou
    if (millis() - gameStartTime > gameDuration) {
      gameEnded = true;
    }

    // Verifica se a meta de dinheiro foi atingida (apenas enquanto o tempo não acabou)
    if (money >= 500 && !gameEnded) {
      textSize(30);
      textAlign(CENTER);
      fill(0, 150, 0);
      text("Meta de R$500 atingida!", width / 2, height / 2 + 50);
      textAlign(LEFT);
    }
  }
}

// ---------- CENÁRIO ----------
function drawBiggerCity() {
  fill(80);
  rect(50, 150, 60, 200);
  rect(130, 180, 70, 170);
  rect(220, 140, 50, 210);
  rect(300, 200, 80, 150); // Novo prédio
  fill(0);
  textSize(18);
  textAlign(CENTER);
  text("Cidade Grande", 200, 130);
}

function drawCarryingDeposit() {
  fill(150);
  rect(truck.carryingDepositX - 30, truck.carryingDepositY - 20, 60, 40);
  fill(0);
  textSize(14);
  textAlign(CENTER);
  text("Depósito", truck.carryingDepositX, truck.carryingDepositY + 15);
}

function drawFarm() {
  fill(34, 139, 34);
  rect(600, 200, 300, 200);
  fill(139, 69, 19);
  for (let i = 600; i < 900; i += 40) {
    rect(i, 180, 10, 40);
  }
  fill(0);
  textSize(18);
  text("Fazenda", 750, 130);
}

function drawRoad() {
  fill(50);
  rect(-1000, 300, 3000, 80);
  stroke(255);
  strokeWeight(4);
  for (let i = -1000; i < 3000; i += 40) {
    line(i, 340, i + 20, 340);
  }
  noStroke();
}

// ---------- CAMINHÃO ----------
function updateTruck() {
  if (truck.direction !== 0) {
    truck.x += truck.speed * truck.direction;
    // Coletar animais ao chegar na fazenda
    if (truck.x >= 600 && truck.x - truck.speed < 600) {
      pickUpAnimals();
    }
    // Depositar animais ao chegar na área de depósito
    if (
      truck.x >= truck.carryingDepositX - 60 &&
      truck.x - truck.speed < truck.carryingDepositX - 60
    ) {
      depositCarrying();
    }
  }
}

function pickUpAnimals() {
  for (let i = animals.length - 1; i >= 0; i--) {
    let a = animals[i];
    if (a.x >= 600 && a.x <= 880) {
      truck.carrying.push(a);
      animals.splice(i, 1);
    }
  }
}

function depositCarrying() {
  if (truck.carrying.length > 0) {
    let totalSale = 0;
   
  }
}