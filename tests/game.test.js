import Game from "../src/game.js";
import Gameboard from "../src/gameboard.js";

describe("Game", () => {
  test("starts with a complete fleet for each player", () => {
    const game = new Game(() => 0);

    game.start();

    expect(game.human.gameboard.ships).toHaveLength(5);
    expect(game.computer.gameboard.ships).toHaveLength(5);
    expect(game.phase).toBe("playing");
  });

  test("a legal human attack is followed by a computer attack", () => {
    const game = new Game(() => 0);
    game.start();

    const result = game.humanAttack([9, 9]);

    expect(result).toBe("miss");
    expect(game.computer.gameboard.attacks.has("9,9")).toBe(true);
    expect(game.human.gameboard.attacks.size).toBe(1);
  });

  test("a repeated human attack does not give the computer another turn", () => {
    const game = new Game(() => 0);
    game.start();

    game.humanAttack([9, 9]);
    const previousComputerAttacks = game.human.gameboard.attacks.size;

    const result = game.humanAttack([9, 9]);

    expect(result).toBe("repeat");
    expect(game.human.gameboard.attacks.size).toBe(previousComputerAttacks);
  });

  test("ends when the human sinks the computer fleet", () => {
    const game = new Game(() => 0);
    game.start();

    game.computer.gameboard = new Gameboard();
    game.computer.gameboard.placeShip(1, [9, 9], "horizontal");

    const result = game.humanAttack([9, 9]);

    expect(result).toBe("hit");
    expect(game.phase).toBe("finished");
    expect(game.winner).toBe("human");
  });

  test("starts a drag-and-drop placement phase", () => {
    const game = new Game(() => 0);

    game.startPlacement();

    expect(game.phase).toBe("placement");
    expect(game.human.gameboard.ships).toHaveLength(0);
    expect(game.computer.gameboard.ships).toHaveLength(5);
    expect(game.pendingFleet).toEqual([5, 4, 3, 3, 2]);
  });

  test("enters play after placing the complete human fleet", () => {
    const game = new Game(() => 0);
    game.startPlacement();

    game.placeHumanShip(5, [0, 0], "horizontal");
    game.placeHumanShip(4, [1, 0], "horizontal");
    game.placeHumanShip(3, [2, 0], "horizontal");
    game.placeHumanShip(3, [3, 0], "horizontal");
    game.placeHumanShip(2, [4, 0], "horizontal");

    expect(game.human.gameboard.ships).toHaveLength(5);
    expect(game.pendingFleet).toHaveLength(0);
    expect(game.phase).toBe("playing");
  });

  test("starts local two-player mode behind a pass-device screen", () => {
    const game = new Game(() => 0);

    game.startTwoPlayer();

    expect(game.mode).toBe("two-player");
    expect(game.currentPlayer).toBe("human");
    expect(game.awaitingPass).toBe(true);
    expect(game.human.gameboard.ships).toHaveLength(5);
    expect(game.computer.gameboard.ships).toHaveLength(5);
  });

  test("switches players after a legal two-player attack", () => {
    const game = new Game(() => 0);
    game.startTwoPlayer();
    game.continueTurn();

    const result = game.twoPlayerAttack([9, 9]);

    expect(result).toBe("miss");
    expect(game.currentPlayer).toBe("computer");
    expect(game.awaitingPass).toBe(true);
    expect(game.computer.gameboard.attacks.has("9,9")).toBe(true);
  });
});
