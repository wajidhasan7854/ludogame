const rollBtn = document.getElementById("roll");
const diceEl = document.getElementById("dice");
const turnEl = document.getElementById("turn");
const tokensContainer = document.getElementById("tokens");

const colors = ["red", "green", "yellow", "blue"];
let currentPlayer = 0;
let diceValue = 0;

// Create 4 tokens per player
const players = colors.map(color => ({
  color,
  tokens: Array(4).fill(null).map((_, i) => createToken(color, i))
}));

function createToken(color, index) {
  const token = document.createElement("div");
  token.classList.add("token", color);
  token.dataset.color = color;
  token.dataset.index = index;
  token.dataset.pos = -1; // -1 means in yard
  tokensContainer.appendChild(token);
  setTokenHomePosition(token, color, index);
  token.addEventListener("click", () => moveToken(token));
  return token;
}

function setTokenHomePosition(token, color, index) {
  const board = document.getElementById("board");
  const size = board.clientWidth / 15;
  const offset = size * 5;

  const homePositions = {
    red: [1, 1],
    green: [1, 10],
    yellow: [10, 1],
    blue: [10, 10]
  };

  const [row, col] = homePositions[color];
  const dx = (index % 2) * size * 2;
  const dy = Math.floor(index / 2) * size * 2;

  token.style.left = `${col * size + dx}px`;
  token.style.top = `${row * size + dy}px`;
}

// Dice roll
rollBtn.addEventListener("click", () => {
  diceValue = Math.floor(Math.random() * 6) + 1;
  diceEl.textContent = diceValue;
});

function moveToken(token) {
  const color = token.dataset.color;
  if (color !== colors[currentPlayer]) return;

  const pos = parseInt(token.dataset.pos);
  if (pos === -1 && diceValue === 6) {
    token.dataset.pos = 0; // enter the board
    placeToken(token, 0, color);
    nextTurn();
  } else if (pos >= 0) {
    const newPos = pos + diceValue;
    if (newPos <= 56) {
      token.dataset.pos = newPos;
      placeToken(token, newPos, color);
      nextTurn();
    }
  }
}

function placeToken(token, pos, color) {
  const board = document.getElementById("board");
  const size = board.clientWidth / 15;
  const path = getPathForColor(color);
  const [row, col] = path[Math.min(pos, path.length - 1)];
  token.style.left = `${col * size + size * 0.15}px`;
  token.style.top = `${row * size + size * 0.15}px`;
}

function nextTurn() {
  if (diceValue !== 6) currentPlayer = (currentPlayer + 1) % 4;
  turnEl.textContent = `Turn: ${colors[currentPlayer].toUpperCase()}`;
}

function getPathForColor(color) {
  const basePath = [];
  for (let i = 0; i < 6; i++) basePath.push([6, i]);
  for (let i = 5; i >= 0; i--) basePath.push([i, 6]);
  for (let i = 0; i < 6; i++) basePath.push([0, 7 + i]);
  for (let i = 1; i < 6; i++) basePath.push([i, 13]);
  for (let i = 1; i < 6; i++) basePath.push([6, 14 - i]);
  for (let i = 1; i < 6; i++) basePath.push([7, 9 - i]);
  return basePath;
}
