import Ship from "../src/ship.js";

describe("Ship", () => {
  test("starts with its given length and zero hits", () => {
    const ship = new Ship(3);

    expect(ship.length).toBe(3);
    expect(ship.hits).toBe(0);
  });
});
