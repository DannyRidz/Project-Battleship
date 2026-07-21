import Ship from "./ship.js";

class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [];
  }

  getCell([row, column]) {
    return this.board[row][column];
  }

  placeShip(length, [row, column], orientation) {
    if (
      !Number.isInteger(length) ||
      length <= 0 ||
      !Number.isInteger(row) ||
      !Number.isInteger(column) ||
      !["horizontal", "vertical"].includes(orientation)
    ) {
      return false;
    }

    const coordinates = [];

    for (let offset = 0; offset < length; offset += 1) {
      const nextRow = orientation === "vertical" ? row + offset : row;
      const nextColumn =
        orientation === "horizontal" ? column + offset : column;

      coordinates.push([nextRow, nextColumn]);
    }

    const canPlace = coordinates.every(
      ([nextRow, nextColumn]) =>
        nextRow >= 0 &&
        nextRow < 10 &&
        nextColumn >= 0 &&
        nextColumn < 10 &&
        this.board[nextRow][nextColumn] === null,
    );

    if (!canPlace) {
      return false;
    }

    const ship = new Ship(length);

    coordinates.forEach(([nextRow, nextColumn]) => {
      this.board[nextRow][nextColumn] = ship;
    });

    this.ships.push(ship);
    return true;
  }
}

export default Gameboard;
