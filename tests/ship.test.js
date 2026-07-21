import Ship from "../src/ship.js";

describe("Ship", () => {
  test("starts with its given length and zero hits", () => {
    const ship = new Ship(3);

    expect(ship.length).toBe(3);
    expect(ship.hits).toBe(0);
  });

  test("hit increases its hit count", () => {
    const ship = new Ship(3);

    ship.hit();
    ship.hit();

    expect(ship.hits).toBe(2);
  });

  test("isSunk reports whether it has enough hits", () => {
    const ship = new Ship(2);

    expect(ship.isSunk()).toBe(false);

    ship.hit();
    ship.hit();

    expect(ship.isSunk()).toBe(true);
  });
});
