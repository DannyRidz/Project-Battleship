import Player from "../src/player.js";

describe("Player", () => {
  test("owns a separate gameboard", () => {
    const human = new Player("human");
    const computer = new Player("computer");

    expect(human.type).toBe("human");
    expect(computer.type).toBe("computer");
    expect(human.gameboard).not.toBe(computer.gameboard);
  });

  test("computer attacks a legal random coordinate", () => {
    const human = new Player("human");
    const computer = new Player("computer");
    const random = jest.fn(() => 0);

    const attack = computer.computerAttack(human.gameboard, random);

    expect(attack.coordinate).toEqual([0, 0]);
    expect(attack.result).toBe("miss");
    expect(human.gameboard.attacks.has("0,0")).toBe(true);
  });

  test("computer targets an adjacent cell after a hit", () => {
    const human = new Player("human");
    const computer = new Player("computer");
    const random = jest.fn(() => 0);

    human.gameboard.placeShip(2, [0, 0], "horizontal");

    const firstAttack = computer.computerAttack(human.gameboard, random);
    const secondAttack = computer.computerAttack(human.gameboard, random);

    expect(firstAttack.coordinate).toEqual([0, 0]);
    expect(firstAttack.result).toBe("hit");
    expect(secondAttack.coordinate).toEqual([1, 0]);
  });
});
