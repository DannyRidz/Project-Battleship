# Battleship Design

## Goal

Build the required version of The Odin Project's Battleship assignment using JavaScript classes, test-driven development, Webpack, Jest, and Babel. Extra-credit features are outside the initial scope.

## Architecture

- `src/ship.js` defines a `Ship` class with length, hit count, `hit()`, and `isSunk()`.
- `src/gameboard.js` defines a `Gameboard` class that owns a 10×10 board, places ships, processes attacks, records misses, and reports when its fleet is sunk.
- `src/player.js` defines human and computer players, each with a gameboard.
- `src/game.js` controls setup, turns, computer attacks, victory, and restarting.
- `src/dom.js` renders game state and translates browser events into game-controller calls.
- `src/index.js` is the browser entry point.
- `src/styles.css` contains presentation rules only.
- `tests/` contains unit tests for game behavior without testing DOM appearance.

Game logic remains independent of the DOM. The DOM module reads game state and forwards user actions but does not implement game rules.

## Domain Behavior

Coordinates use `[row, column]`, where each value is an integer from 0 through 9.

A ship stores its length and number of hits. `hit()` increments its hit count, while `isSunk()` derives its result by comparing hits with length.

A gameboard stores placed ships and attack history. It rejects out-of-bounds and overlapping placements. A legal attack records a hit or miss; a repeated or invalid attack is rejected without changing state. The board reports when all placed ships have sunk.

Each player owns a gameboard. A computer player selects random legal coordinates and never deliberately repeats an attack.

The game controller creates the players, populates their fleets, alternates turns after legal attacks, and ends play when either fleet has sunk. Human ship placement supports a chosen starting coordinate and horizontal or vertical orientation. Computer fleets use random legal placements.

## Error Handling

Public operations validate coordinates and placement orientation. Invalid placements and attacks return a clear failure result without partially modifying state. The UI uses these results to show feedback and keep the same turn when appropriate.

## Testing Strategy

Development follows short red-green-refactor cycles: write one focused test, confirm it fails for the expected reason, implement the smallest behavior that passes, and rerun the suite. Tests cover public behavior of Ship, Gameboard, Player, and DOM-independent game control. Visual appearance and browser DOM structure are verified manually, consistent with the assignment guidance.

## Delivery Sequence

1. Configure npm, Webpack, Babel, and Jest.
2. Build Ship through small TDD cycles.
3. Build Gameboard placement and attack behavior through TDD.
4. Build Player and legal computer attacks through TDD.
5. Build the game controller and victory flow.
6. Add board rendering and user interaction.
7. Add human and computer ship placement.
8. Polish styling and manually verify a complete game.

At every learning step, the learner types the requested change and the codebase is reviewed before the next step is issued.
