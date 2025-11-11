const canvas = document.getElementById('game-layer');
const ctx = canvas.getContext('2d');
const diceEl = document.getElementById('dice');
const turnEl = document.getElementById('turn');
const rollBtn = document.getElementById('roll');

const colors = ['red', 'green', 'yellow', 'blue'];
let currentPlayer = 0;
let dice = 0;
let tokens = [];
let paths = {};
let cellSize = 0;

// adjust canvas to fit board size
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  cellSize = canvas.width / 15;
  drawBoard();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw tokens
  tokens.forEach(t => {
    if (t.state === 'board') drawToken(t);
  });
}

function drawToken(t) {
  const path = paths[t.color];
  if (!path[t.pos]) return;
  const [r, c] = path[t.pos];
  const x = c * cellSize + cellSize / 2;
  const y = r * cellSize + cellSize / 2;
  ctx.beginPath();
  ctx.arc(x, y, cellSize * 0.35, 0, 2 * Math.PI);
  ctx.fillStyle = t.color;
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function initTokens() {
  tokens = [];
  colors.forEach(color => {
    for (let i = 0; i < 4; i++) {
      tokens.push({
        color,
        id: `${color}${i}`,
        state: 'home',
        pos: 0
      });
    }
  });
}

// simplified paths for now (15x15 grid loop)
function buildPaths() {
  const base = [];
  for (let i = 0; i < 6; i++) base.push([6, i]);
  for (let i = 5; i >= 0; i--) base.push([i, 6]);
  for (let i = 0; i < 6; i++) base.push([0, 7 + i]);
  for (let i = 1; i < 6; i++) base.push([i, 13]);
  for (let i = 1; i < 6; i++) base.push([6, 14 - i]);
  for (let i = 1; i < 6; i++) base.push([7, 9 - i]);
  colors.forEach(c => paths[c] = base);
}

rollBtn.addEventListener('click', () => {
  dice = Math.floor(Math.random() * 6) + 1;
  diceEl.textContent = dice;
  moveToken();
});

function moveToken() {
  const playerColor = colors[currentPlayer];
  const token = tokens.find(t => t.color === playerColor && t.state !== 'finished');
  if (!token) return;

  if (token.state === 'home' && dice === 6) {
    token.state = 'board';
    token.pos = 0;
  } else if (token.state === 'board') {
    token.pos += dice;
  }

  drawBoard();

  if (dice !== 6) {
    currentPlayer = (currentPlayer + 1) % colors.length;
  }
  turnEl.textContent = `Turn: ${colors[currentPlayer].toUpperCase()}`;
}

buildPaths();
initTokens();
drawBoard();
