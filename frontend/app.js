import init, { Game, Direction, GameStates } from "../pkg/wasm_snake.js";
const FPS = 15;

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const MAX_WIDTH = innerWidth - 20;
const MAX_HEIGHT = (innerHeight - 20) * 0.7;

let game;

const generateMenu = document.getElementById("generate");
const openGenerateBtn = document.getElementById("openGenerateBtn");
let generateMenuOpen = true;

let controls = document.getElementById("controls");

let leftBtn = document.getElementById("left-btn");
let rightBtn = document.getElementById("right-btn");
let upBtn = document.getElementById("up-btn");
let downBtn = document.getElementById("down-btn");

// const GRID_SIZE = Math.min(CANVAS_WIDTH / WIDTH, CANVAS_HEIGHT / HEIGHT);

const BLOCK_COLORS = [
  [255, 255, 255],
  [255, 0, 0],
  [0, 255, 0],
];

const initGame = async (width, height, grid_size) => {
  hideGenerateMenu();
  let wasmInstance = await init();
  game = Game.init(width, height);

  let blockPtrs = game.get_blocks();
  let blocks = new Uint8Array(
    wasmInstance.memory.buffer,
    blockPtrs,
    width * height
  );

  let gameInterval = setInterval(() => {
    requestAnimationFrame(update);
  }, 1000 / FPS);

  const update = () => {
    if (!game) return;
    let gameStateIndex = game.tick();

    const gameState = GameStates[gameStateIndex];

    if (gameState === "Over") {
      console.log("game over");
      cleanup();
      return;
    } else if (gameState === "Win") {
      console.log("You win!");
      cleanup();
      return;
    }

    render(game, blocks, width, height, grid_size);
  };

  const moveLeft = () => {
    game.change_snake_direction(Direction.Left);
  };
  const moveRight = () => {
    game.change_snake_direction(Direction.Right);
  };
  const moveUp = () => {
    game.change_snake_direction(Direction.Up);
  };
  const moveDown = () => {
    game.change_snake_direction(Direction.Down);
  };

  function onKeyDown(event) {
    console.log(event.key);
    switch (event.key) {
      case "w":
        moveUp();
        break;
      case "a":
        moveLeft();
        break;
      case "s":
        moveDown();
        break;
      case "d":
        moveRight();
        break;

      default:
        break;
    }
  }

  document.addEventListener("keydown", onKeyDown);

  leftBtn.addEventListener("click", moveLeft);
  rightBtn.addEventListener("click", moveRight);
  upBtn.addEventListener("click", moveUp);
  downBtn.addEventListener("click", moveDown);

  const cleanup = () => {
    console.log("cleanup");
    console.log(onKeyDown);
    // ongoingGame = false;
    game = null;
    clearInterval(gameInterval);

    document.removeEventListener("keydown", onKeyDown);
    leftBtn.removeEventListener("click", moveUp);
    rightBtn.removeEventListener("click", moveRight);
    upBtn.removeEventListener("click", moveUp);
    downBtn.removeEventListener("click", moveDown);
  };
};

function render(game, blocks, width, height, grid_size) {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const index = game.get_index(j, i);

      let rgb = BLOCK_COLORS[blocks[index]];

      ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]},${rgb[2]})`;

      ctx.fillRect(i * grid_size, j * grid_size, grid_size, grid_size);
    }
  }
}

function hideGenerateMenu() {
  if (!generateMenu || !generateMenuOpen) return;
  generateMenuOpen = false;
  generateMenu.style.display = "none";
  openGenerateBtn.style.display = "block";
  controls.style.display = "grid";
}

function showGenerateMenu() {
  if (!generateMenu || generateMenuOpen) return;
  generateMenuOpen = true;
  generateMenu.style.display = "block";
  openGenerateBtn.style.display = "none";
  controls.style.display = "none";
}

function main() {
  const widthInput = document.getElementById("game-width-input");
  const heightInput = document.getElementById("game-height-input");
  const initBtn = document.getElementById("game-init-btn");

  initBtn.onclick = async () => {
    const width = widthInput.value;
    const height = heightInput.value;

    if (width <= 0 || height <= 0 || game) return;
    console.log("Start new game");
    const grid_size = Math.floor(
      Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
    );

    canvas.width = grid_size * width;
    canvas.height = grid_size * height;

    await initGame(width, height, grid_size);
  };

  openGenerateBtn.onclick = showGenerateMenu;
}

main();
