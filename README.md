# Battleship

A browser-based Battleship game built for The Odin Project.

## Features

- Human versus computer gameplay
- Random legal fleet placement
- Turn-based attacks
- Hit and miss tracking
- Repeated-attack prevention
- Victory detection
- Responsive gameboards
- Unit-tested game logic
- Drag-and-drop fleet placement with rotation
- Local two-player mode with a pass-device privacy screen
- Smarter computer targeting after successful hits

## Architecture

- `Ship` tracks a ship's length, hits, and sunk state.
- `Gameboard` handles placement, attacks, misses, and fleet status.
- `Player` owns a gameboard and provides computer attacks.
- `Game` controls setup, turns, randomized fleets, and victory.
- `dom.js` renders game state and handles browser interaction.
