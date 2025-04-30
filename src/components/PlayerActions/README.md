# PlayerActions Components Overview

This folder contains the **player interaction buttons** and **status displays** for the Asteria Game UI.  
Each component communicates with the main game state managed in `/pages/map/index.tsx`.

---

## 📺 Architecture

```
MapPage (pages/map/index.tsx)
 ├── GameGrid (components/GameMap/GameGrid.tsx)
 │    ↔ select target position
 └── Aside Sidebar
      ├── PlayerActions
      │    ├── MoveShip (Confirm move button)
      │    └── (future buttons: CreateShip, MineAsteria, etc.)
      └── ShowPilot (displays current position and fuel)
```

---

## 📦 Components

| Component | Purpose | Notes |
|:----------|:--------|:------|
| **MoveShip.tsx** | Button that lets the player confirm a ship movement after selecting a target position. | Checks fuel availability before allowing move. Updates position and fuel level locally. |
| **ShowPilot.tsx** | Displays current ship `x`, `y` coordinates and remaining fuel. | Updates automatically based on game state changes. |
| **(other files)** | `CreateShip`, `MineAsteria`, `GatherFuel`, `QuitGame` will follow a similar structure. | Future extensions planned here. |

---

## 🔄 Data Flow

- **Props** are passed **from `MapPage` down** into these components.
- **State Changes** happen **via setter functions** (`setCurrentPosition`, `setFuelLevel`, etc.) passed as props.
- **No internal state** is maintained in these components — everything is lifted to `MapPage` for consistency.

---

## ⚡ How Movement Works (Current System)

1. Player clicks a tile on the GameGrid.
2. The clicked position is stored in `targetPosition`.
3. The `MoveShip` button becomes enabled.
4. When the player clicks "Confirm Move":
   - Calculates the fuel cost based on distance.
   - If enough fuel, updates `currentPosition` and `fuelLevel`.
   - Resets `targetPosition` after move.

---

## 🛠️ Future Plans

- Integrate actual **Mesh SDK blockchain transactions** inside `MoveShip`.
- Add additional buttons for **Create Ship**, **Gather Fuel**, **Mine Asteria**, **Quit Game** using the same prop structure.
- Modularize game operations clearly by maintaining simple prop-based communication.

---

## 📚 Key Concepts

| Concept | Example |
|:--------|:--------|
| Lifting state up | All game state (position, fuel) lives in `MapPage`. |
| Unidirectional Data Flow | Props flow down, events/actions update state back up. |
| Stateless UI Components | PlayerAction components are pure UI — no hidden local state. |

---

> 📢 _"Think of these components as 'dumb buttons and displays' that simply visualize or trigger actions based on the real source of truth in the GamePage."_  

---

# ✅ End of README

