function createBoard(gameboard, revealShips, onAttack, onDrop) {
  const boardElement = document.createElement("div");
  boardElement.classList.add("board");

  for (let row = 0; row < 10; row += 1) {
    for (let column = 0; column < 10; column += 1) {
      const cell = document.createElement("button");
      const coordinateKey = `${row},${column}`;
      const ship = gameboard.getCell([row, column]);
      const wasAttacked = gameboard.attacks.has(coordinateKey);

      cell.type = "button";
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.column = column;
      cell.setAttribute("aria-label", `Row ${row + 1}, column ${column + 1}`);

      if (wasAttacked && ship !== null) {
        cell.classList.add("hit");
        cell.textContent = "×";
      } else if (gameboard.missedAttacks.has(coordinateKey)) {
        cell.classList.add("miss");
        cell.textContent = "•";
      } else if (revealShips && ship !== null) {
        cell.classList.add("ship");
      }

      if (onAttack && !wasAttacked) {
        cell.addEventListener("click", () => onAttack([row, column]));
      } else if (!onDrop) {
        cell.disabled = true;
      }

      if (onDrop) {
        cell.addEventListener("dragover", (event) => {
          event.preventDefault();
        });

        cell.addEventListener("drop", (event) => {
          event.preventDefault();
          const length = Number(event.dataTransfer.getData("text/plain"));
          onDrop(length, [row, column]);
        });
      }

      boardElement.append(cell);
    }
  }

  return boardElement;
}

function createPlacementControls(game, root) {
  const controls = document.createElement("section");
  controls.classList.add("placement-controls");

  const instructions = document.createElement("p");
  instructions.textContent =
    "Drag a ship onto the board using its first square.";

  const rotateButton = document.createElement("button");
  rotateButton.type = "button";
  rotateButton.classList.add("restart");
  rotateButton.textContent = `Orientation: ${game.placementOrientation}`;
  rotateButton.addEventListener("click", () => {
    game.toggleOrientation();
    renderGame(game, root);
  });

  const dock = document.createElement("div");
  dock.classList.add("ship-dock");

  game.pendingFleet.forEach((length) => {
    const shipButton = document.createElement("button");
    shipButton.type = "button";
    shipButton.classList.add("ship-option");
    shipButton.draggable = true;
    shipButton.textContent = `Ship: ${length}`;

    shipButton.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", String(length));
    });

    dock.append(shipButton);
  });

  controls.append(instructions, rotateButton, dock);
  return controls;
}

function createModeButtons(game, root) {
  const controls = document.createElement("div");
  controls.classList.add("game-actions");

  const computerButton = document.createElement("button");
  computerButton.type = "button";
  computerButton.classList.add("restart");
  computerButton.textContent = "New game vs computer";
  computerButton.addEventListener("click", () => {
    game.startPlacement();
    renderGame(game, root);
  });

  const twoPlayerButton = document.createElement("button");
  twoPlayerButton.type = "button";
  twoPlayerButton.classList.add("restart");
  twoPlayerButton.textContent = "New two-player game";
  twoPlayerButton.addEventListener("click", () => {
    game.startTwoPlayer();
    renderGame(game, root);
  });

  controls.append(computerButton, twoPlayerButton);
  return controls;
}

function renderGame(game, root) {
  root.replaceChildren();

  const heading = document.createElement("h1");
  heading.textContent = "Battleship";

  const status = document.createElement("p");
  status.classList.add("status");
  status.textContent = game.message;

  if (game.mode === "two-player" && game.awaitingPass) {
    const readyButton = document.createElement("button");
    readyButton.type = "button";
    readyButton.classList.add("restart");
    readyButton.textContent = "I am ready";
    readyButton.addEventListener("click", () => {
      game.continueTurn();
      renderGame(game, root);
    });

    root.append(heading, status, readyButton, createModeButtons(game, root));
    return;
  }

  if (game.phase === "placement") {
    const playerSection = document.createElement("section");
    const playerHeading = document.createElement("h2");
    playerHeading.textContent = "Place your fleet";

    const placementBoard = createBoard(
      game.human.gameboard,
      true,
      null,
      (length, coordinate) => {
        game.placeHumanShip(length, coordinate, game.placementOrientation);
        renderGame(game, root);
      },
    );

    playerSection.append(playerHeading, placementBoard);

    root.append(
      heading,
      status,
      createPlacementControls(game, root),
      playerSection,
      createModeButtons(game, root),
    );
    return;
  }

  const boards = document.createElement("div");
  boards.classList.add("boards");

  let activePlayer = game.human;
  let defendingPlayer = game.computer;
  let playerLabel = "Your fleet";
  let enemyLabel = "Enemy waters";
  let attackHandler = (coordinate) => game.humanAttack(coordinate);

  if (game.mode === "two-player") {
    const playerOneTurn = game.currentPlayer === "human";

    activePlayer = playerOneTurn ? game.human : game.computer;
    defendingPlayer = playerOneTurn ? game.computer : game.human;
    playerLabel = playerOneTurn ? "Player 1 fleet" : "Player 2 fleet";
    enemyLabel = playerOneTurn ? "Player 2 waters" : "Player 1 waters";
    attackHandler = (coordinate) => game.twoPlayerAttack(coordinate);
  }

  const playerSection = document.createElement("section");
  const playerHeading = document.createElement("h2");
  playerHeading.textContent = playerLabel;
  playerSection.append(
    playerHeading,
    createBoard(activePlayer.gameboard, true, null, null),
  );

  const enemySection = document.createElement("section");
  const enemyHeading = document.createElement("h2");
  enemyHeading.textContent = enemyLabel;
  enemySection.append(
    enemyHeading,
    createBoard(
      defendingPlayer.gameboard,
      false,
      game.phase === "playing"
        ? (coordinate) => {
            attackHandler(coordinate);
            renderGame(game, root);
          }
        : null,
      null,
    ),
  );

  boards.append(playerSection, enemySection);

  root.append(heading, status, boards, createModeButtons(game, root));
}

export default renderGame;
