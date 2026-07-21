import Gameboard from "../src/gameboard.js";

describe("Gameboard ship placement", () => {
  test("places a ship horizontally", () => {
    const gameboard = new Gameboard();

    const placed = gameboard.placeShip(3, [2, 4], "horizontal");

    expect(placed).toBe(true);
    expect(gameboard.ships).toHaveLength(1);
    expect(gameboard.getCell([2, 4])).toBe(gameboard.ships[0]);
    expect(gameboard.getCell([2, 5])).toBe(gameboard.ships[0]);
    expect(gameboard.getCell([2, 6])).toBe(gameboard.ships[0]);
  });

  test("places a ship vertically", () => {
    const gameboard = new Gameboard();

    const placed = gameboard.placeShip(2, [5, 3], "vertical");

    expect(placed).toBe(true);
    expect(gameboard.getCell([5, 3])).toBe(gameboard.ships[0]);
    expect(gameboard.getCell([6, 3])).toBe(gameboard.ships[0]);
  });

  test("rejects a ship that leaves the board", () => {
    const gameboard = new Gameboard();

    const placed = gameboard.placeShip(3, [9, 8], "horizontal");

    expect(placed).toBe(false);
    expect(gameboard.ships).toHaveLength(0);
  });

  test("rejects ships that overlap", () => {
    const gameboard = new Gameboard();

    gameboard.placeShip(3, [4, 2], "horizontal");
    const placed = gameboard.placeShip(2, [3, 3], "vertical");

    expect(placed).toBe(false);
    expect(gameboard.ships).toHaveLength(1);
  });
});

describe("Gameboard attacks", () => {
  test("hits a ship at an occupied coordinate", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(2, [1, 1], "horizontal");

    const result = gameboard.receiveAttack([1, 1]);

    expect(result).toBe("hit");
    expect(gameboard.ships[0].hits).toBe(1);
  });

  test("records a missed attack", () => {
    const gameboard = new Gameboard();

    const result = gameboard.receiveAttack([3, 4]);

    expect(result).toBe("miss");
    expect(gameboard.missedAttacks.has("3,4")).toBe(true);
  });

  test("rejects a repeated attack without hitting twice", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(2, [1, 1], "horizontal");

    gameboard.receiveAttack([1, 1]);
    const result = gameboard.receiveAttack([1, 1]);

    expect(result).toBe("repeat");
    expect(gameboard.ships[0].hits).toBe(1);
  });

  test("reports when every ship has sunk", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(1, [0, 0], "horizontal");

    expect(gameboard.allShipsSunk()).toBe(false);

    gameboard.receiveAttack([0, 0]);

    expect(gameboard.allShipsSunk()).toBe(true);
  });
});
