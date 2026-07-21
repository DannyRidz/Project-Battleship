# Battleship Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-based Battleship game against a computer while learning test-driven JavaScript development.

**Architecture:** Domain classes hold all game rules independently of the DOM. A game controller coordinates players and turns, while a DOM module renders controller state and forwards browser events.

**Tech Stack:** JavaScript ES modules, npm, Webpack 5, Babel, Jest, HTML, and CSS

## Global Constraints

- Use JavaScript classes for `Ship`, `Gameboard`, and `Player`.
- Use `[row, column]` coordinates containing integers from 0 through 9.
- Complete required assignment behavior before extra credit.
- Follow red-green-refactor: observe every new test fail before implementing it.
- Do not unit-test DOM appearance.
- The learner types each implementation step; review the repository before issuing the next step.

---

## File Map

- `package.json`: dependency list and development commands.
- `babel.config.cjs`: transforms ES modules for Jest.
- `webpack.config.js`: bundles the browser application.
- `src/ship.js`: ship state and sinking behavior.
- `src/gameboard.js`: fleet placement and attack state.
- `src/player.js`: human/computer identity and computer attack selection.
- `src/game.js`: setup, turn flow, and victory state.
- `src/dom.js`: board rendering and event handling.
- `src/index.js`: browser entry point.
- `src/template.html`: page structure.
- `src/styles.css`: visual presentation.
- `tests/*.test.js`: public domain and controller behavior.

### Task 1: Tooling and Browser Skeleton

**Files:**
- Create: `package.json`
- Create: `babel.config.cjs`
- Create: `webpack.config.js`
- Create: `src/template.html`
- Create: `src/index.js`
- Create: `src/styles.css`

**Interfaces:**
- Produces: `npm test`, `npm run build`, and `npm start` commands.

- [ ] Initialize npm with `npm init -y`.
- [ ] Install runtime tooling with `npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin css-loader style-loader jest babel-jest @babel/core @babel/preset-env`.
- [ ] Set `scripts.test` to `jest`, `scripts.build` to `webpack --mode production`, and `scripts.start` to `webpack serve --mode development --open` in `package.json`; set `private` to `true`.
- [ ] Configure `babel.config.cjs` to export `{ presets: [['@babel/preset-env', { targets: { node: 'current' } }]] }`.
- [ ] Configure Webpack with `./src/index.js` as its entry, `dist/main.js` as its output, `HtmlWebpackPlugin` using `src/template.html`, and `style-loader`/`css-loader` for `.css` files.
- [ ] Create an HTML document containing `<main id="app"><h1>Battleship</h1></main>`.
- [ ] Import `./styles.css` from `src/index.js` and add a minimal body font rule.
- [ ] Run `npm test -- --passWithNoTests` and expect exit code 0.
- [ ] Run `npm run build` and expect a successful compilation.
- [ ] Commit with `git commit -m "chore: configure Battleship project"`.

### Task 2: Ship Class

**Files:**
- Create: `tests/ship.test.js`
- Create: `src/ship.js`

**Interfaces:**
- Produces: `new Ship(length)`, public `length`, public `hits`, `hit(): void`, and `isSunk(): boolean`.

- [ ] Write a test importing `Ship`, constructing `new Ship(3)`, and expecting `length` to be `3` and `hits` to be `0`.
- [ ] Run `npm test -- ship.test.js` and expect failure because `src/ship.js` does not exist.
- [ ] Export a `Ship` class whose constructor assigns `length` and initializes `hits` to zero.
- [ ] Run the test and expect it to pass.
- [ ] Add a test that calls `hit()` twice and expects `hits` to be `2`; run it and observe the expected failure.
- [ ] Add `hit() { this.hits += 1; }`; rerun and expect a pass.
- [ ] Add tests expecting a length-two ship to be afloat after one hit and sunk after two; observe the failure.
- [ ] Add `isSunk() { return this.hits >= this.length; }`; rerun the whole suite.
- [ ] Commit with `git commit -m "feat: add Ship class"`.

### Task 3: Gameboard Placement

**Files:**
- Create: `tests/gameboard.test.js`
- Create: `src/gameboard.js`

**Interfaces:**
- Consumes: `new Ship(length)`.
- Produces: `new Gameboard()`, `ships`, `placeShip(length, [row, column], orientation): boolean`, and `getCell([row, column])`.

- [ ] Test successful horizontal and vertical placements by asserting occupied cells refer to the placed ship; observe failure.
- [ ] Implement a 10×10 `board` initialized with `null`, a `ships` array, and placement that creates one `Ship` and assigns it to each occupied cell.
- [ ] Test rejection of an out-of-bounds placement without board mutation; observe failure, validate every proposed coordinate, then rerun.
- [ ] Test rejection of overlapping ships without board mutation; observe failure, require every proposed cell to be empty, then rerun.
- [ ] Test rejection of invalid length, coordinates, and orientation; implement validation returning `false`.
- [ ] Run the complete suite and commit with `git commit -m "feat: place ships on Gameboard"`.

### Task 4: Gameboard Attacks and Fleet Status

**Files:**
- Modify: `tests/gameboard.test.js`
- Modify: `src/gameboard.js`

**Interfaces:**
- Produces: `receiveAttack([row, column]): 'hit' | 'miss' | 'repeat' | 'invalid'`, public `missedAttacks`, and `allShipsSunk(): boolean`.

- [ ] Test that attacking an occupied cell calls the ship's behavior and returns `'hit'`; observe failure, then implement it.
- [ ] Test that an empty-cell attack returns `'miss'` and stores a coordinate key such as `'2,3'` in `missedAttacks`; implement with a `Set`.
- [ ] Test that attacking the same coordinate again returns `'repeat'` without adding a hit; add an `attacks` set and implement the guard.
- [ ] Test that malformed or out-of-range coordinates return `'invalid'`; reuse coordinate validation.
- [ ] Test that `allShipsSunk()` is false with an afloat ship and true after all placed ships receive enough hits; implement it with `every` while ensuring an empty fleet returns false.
- [ ] Run the suite and commit with `git commit -m "feat: process Gameboard attacks"`.

### Task 5: Players and Computer Attacks

**Files:**
- Create: `tests/player.test.js`
- Create: `src/player.js`

**Interfaces:**
- Consumes: `new Gameboard()` and `Gameboard.receiveAttack(coordinate)`.
- Produces: `new Player(type)`, public `type`, public `gameboard`, and `computerAttack(enemyBoard, random = Math.random): { coordinate, result }`.

- [ ] Test that human and computer players each receive distinct gameboards; observe failure, then implement constructor validation and board creation.
- [ ] Test computer attack with a stubbed random function so the chosen coordinate is predictable; implement coordinate selection and call `enemyBoard.receiveAttack()`.
- [ ] Test retry behavior when the first random coordinate was attacked previously; implement retry until the result is neither `'repeat'` nor `'invalid'`.
- [ ] Run the suite and commit with `git commit -m "feat: add human and computer players"`.

### Task 6: Game Controller

**Files:**
- Create: `tests/game.test.js`
- Create: `src/game.js`

**Interfaces:**
- Consumes: `Player`, board placement, attacks, and fleet status.
- Produces: `new Game()`, `start()`, `humanAttack(coordinate)`, `computerTurn()`, `phase`, `message`, `winner`, `human`, and `computer`.

- [ ] Test that `start()` creates both player types, exposes the standard pending fleet lengths `[5, 4, 3, 3, 2]`, and enters the `'placement'` phase; implement that exact initialization.
- [ ] Test that a legal human attack updates the computer board and triggers exactly one computer turn; implement the turn sequence.
- [ ] Test that repeated/invalid human attacks do not give the computer a turn; implement result guards.
- [ ] Test that sinking the final ship sets `phase` to `'finished'`, assigns `winner`, and prevents further attacks; implement end-game checks after each legal attack.
- [ ] Run the suite and commit with `git commit -m "feat: control Battleship turns"`.

### Task 7: DOM Rendering and Play Interaction

**Files:**
- Create: `src/dom.js`
- Modify: `src/index.js`
- Modify: `src/template.html`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: public `Game` state and `game.humanAttack([row, column])`.
- Produces: `renderGame(game, root)` and click-driven attacks.

- [ ] Add status, player-board, computer-board, and restart containers to the template.
- [ ] Implement a pure `createBoardElement(gameboard, revealShips, onCellClick)` helper that creates 100 buttons with `data-row` and `data-column`.
- [ ] Render player ships, all hits/misses, and only discovered computer ships using CSS state classes.
- [ ] Attach computer-cell clicks to `humanAttack`, then rerender from current state.
- [ ] Wire `new Game()`, `start()`, and `renderGame()` in `index.js`.
- [ ] Style two responsive 10×10 grids, clear hit/miss/ship states, disabled cells, status, and restart control.
- [ ] Run `npm run build`, launch with `npm start`, and manually verify legal attacks, repeats, alternating turns, and victory.
- [ ] Commit with `git commit -m "feat: add playable Battleship interface"`.

### Task 8: Human and Random Ship Placement

**Files:**
- Modify: `tests/game.test.js`
- Modify: `src/game.js`
- Modify: `src/dom.js`
- Modify: `src/styles.css`

**Interfaces:**
- Produces: `placeHumanShip(coordinate, orientation): boolean`, `toggleOrientation()`, and automatic legal computer fleet placement.

- [ ] Test placement-phase progression through `[5, 4, 3, 3, 2]`; implement one legal human placement at a time.
- [ ] Test that invalid placement leaves the same ship pending; implement a clear controller message.
- [ ] Test that computer random placement produces five non-overlapping, in-bounds ships; implement retries using `Gameboard.placeShip()`.
- [ ] Render a placement prompt, orientation button, and board-cell placement controls before play begins.
- [ ] Transition to play only when both fleets contain all five ships.
- [ ] Run all tests and `npm run build`, then manually complete a game from placement through victory.
- [ ] Commit with `git commit -m "feat: add fleet placement flow"`.

### Task 9: Final Verification

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: all completed application commands and behavior.
- Produces: project usage instructions.

- [ ] Document installation, `npm test`, `npm start`, `npm run build`, game rules, and module structure.
- [ ] Run `npm test -- --runInBand` and expect every test to pass.
- [ ] Run `npm run build` and expect a successful production compilation.
- [ ] Manually verify narrow and wide layouts, placement errors, repeat attacks, computer legality, restart, and both victory outcomes.
- [ ] Commit with `git commit -m "docs: document Battleship project"`.
