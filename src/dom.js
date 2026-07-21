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

function createRestartButton(game, root) {
  const restartButton = document.createElement("button");
  restartButton.type = "button";
  restartButton.classList.add("restart");
  restartButton.textContent = "Place new fleets";
  restartButton.addEventListener("click", () => {
    game.startPlacement();
    renderGame(game, root);
  });

  return restartButton;
}

function renderGame(game, root) {
  root.replaceChildren();

  const heading = document.createElement("h1");
  heading.textContent = "Battleship";

  const status = document.createElement("p");
  status.classList.add("status");
  status.textContent = game.message;

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
      createRestartButton(game, root),
    );

    return;
  }

  const boards = document.createElement("div");
  boards.classList.add("boards");

  const playerSection = document.createElement("section");
  const playerHeading = document.createElement("h2");
  playerHeading.textContent = "Your fleet";
  playerSection.append(
    playerHeading,
    createBoard(game.human.gameboard, true, null, null),
  );

  const computerSection = document.createElement("section");
  const computerHeading = document.createElement("h2");
  computerHeading.textContent = "Enemy waters";
  computerSection.append(
    computerHeading,
    createBoard(
      game.computer.gameboard,
      false,
      game.phase === "playing"
        ? (coordinate) => {
            game.humanAttack(coordinate);
            renderGame(game, root);
          }
        : null,
      null,
    ),
  );

  boards.append(playerSection, computerSection);

  root.append(heading, status, boards, createRestartButton(game, root));
}

export default renderGame;
