function createBoard(gameboard, revealShips, onAttack) {
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
      } else {
        cell.disabled = true;
      }

      boardElement.append(cell);
    }
  }

  return boardElement;
}

function renderGame(game, root) {
  root.replaceChildren();

  const heading = document.createElement("h1");
  heading.textContent = "Battleship";

  const status = document.createElement("p");
  status.classList.add("status");
  status.textContent = game.message;

  const boards = document.createElement("div");
  boards.classList.add("boards");

  const playerSection = document.createElement("section");
  const playerHeading = document.createElement("h2");
  playerHeading.textContent = "Your fleet";
  playerSection.append(
    playerHeading,
    createBoard(game.human.gameboard, true, null),
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
    ),
  );

  boards.append(playerSection, computerSection);

  const restartButton = document.createElement("button");
  restartButton.type = "button";
  restartButton.classList.add("restart");
  restartButton.textContent = "New game";
  restartButton.addEventListener("click", () => {
    game.start();
    renderGame(game, root);
  });

  root.append(heading, status, boards, restartButton);
}

export default renderGame;
