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
});
