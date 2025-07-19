import React, { useEffect, useRef, useState } from "react";

interface Ship {
  id: number;
  x: number;
  y: number;
  fuel: number;
}

interface Pellet {
  id: number;
  x: number;
  y: number;
  fuel: number;
}

const GameStart: React.FC = () => {
  const gridSize = 200; //
  const moveStep = 5;
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate boundaries based on gridSize
  const boundary = gridSize / 2; // e.g., ±150 for gridSize=300, ±100 for gridSize=200

  const generateInitialPellets = (): Pellet[] => {
    const pellets: Pellet[] = [
      { id: 1, x: -20, y: 5, fuel: 5 },
      { id: 2, x: 25, y: -30, fuel: 10 }, // Fixed y to be within bounds
    ];
    for (let i = 3; i <= 20; i++) {
      pellets.push({
        id: i,
        x:
          Math.floor(
            (Math.random() * (gridSize - 20) - (gridSize / 2 - 10)) / moveStep,
          ) * moveStep,
        y:
          Math.floor(
            (Math.random() * (gridSize - 20) - (gridSize / 2 - 10)) / moveStep,
          ) * moveStep,
        fuel: Math.floor(Math.random() * 20) + 5,
      });
    }
    return pellets;
  };

  const [ships, setShips] = useState<Ship[]>([
    { id: 1, x: -10, y: -10, fuel: 100 },
    { id: 2, x: 15, y: 10, fuel: 100 },
  ]);
  const [pellets, setPellets] = useState<Pellet[]>(generateInitialPellets());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Load saved game state
  useEffect(() => {
    const savedState = localStorage.getItem("initialGameState");
    if (savedState) {
      const {
        ships: savedShips,
        pellets: savedPellets,
        score: savedScore,
      } = JSON.parse(savedState);
      setShips(savedShips);
      setPellets(savedPellets);
      setScore(savedScore);
    }
    containerRef.current?.focus();
  }, []);

  // Save game state
  useEffect(() => {
    localStorage.setItem(
      "initialGameState",
      JSON.stringify({ ships, pellets, score }),
    );
  }, [ships, pellets, score]);

  // Handle ship movement and exact-coordinate collision
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        selectedIndex === null ||
        selectedIndex < 0 ||
        selectedIndex >= ships.length ||
        gameOver
      )
        return;

      const ship = ships[selectedIndex]!;
      let newX = ship.x;
      let newY = ship.y;

      switch (e.key) {
        case "ArrowUp":
          newY = Math.max(-boundary, ship.y - moveStep);
          break;
        case "ArrowDown":
          newY = Math.min(boundary, ship.y + moveStep);
          break;
        case "ArrowLeft":
          newX = Math.max(-boundary, ship.x - moveStep);
          break;
        case "ArrowRight":
          newX = Math.min(boundary, ship.x + moveStep);
          break;
        default:
          return;
      }

      // Check for exact-coordinate pellet collision
      const newPellets = pellets.filter((pellet) => {
        if (newX === pellet.x && newY === pellet.y) {
          setScore((prev) => prev + pellet.fuel);
          setShips((prev) =>
            prev.map((s, i) =>
              i === selectedIndex ? { ...s, fuel: s.fuel + pellet.fuel } : s,
            ),
          );
          return false; // Remove collected pellet
        }
        return true;
      });

      // Update ship position and consume fuel
      setShips((prev) =>
        prev.map((s, i) =>
          i === selectedIndex
            ? { ...s, x: newX, y: newY, fuel: Math.max(0, s.fuel - 0.5) }
            : s,
        ),
      );
      setPellets(newPellets);

      // Check for game over
      if (ships[selectedIndex]?.fuel! <= 0) {
        setGameOver(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, ships, pellets, gameOver, boundary]);

  const handleShipClick = (index: number) => {
    if (!gameOver) {
      setSelectedIndex(index);
      containerRef.current?.focus();
    }
  };

  const handleQuit = () => {
    setShips([
      { id: 1, x: -10, y: -10, fuel: 100 },
      { id: 2, x: 15, y: 10, fuel: 100 },
    ]);
    setPellets(generateInitialPellets());
    setSelectedIndex(null);
    setScore(0);
    setGameOver(false);
    localStorage.removeItem("initialGameState");
  };

  const toPercent = (val: number) => `${((val + boundary) / gridSize) * 100}%`;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden outline-none"
      style={{
        backgroundImage: "url('/visualizer/background2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Score and status display */}
      <div className="absolute left-4 top-4 rounded-md bg-black bg-opacity-70 px-4 py-2 text-white">
        Score: {score} | Fuel: {ships[selectedIndex!]?.fuel.toFixed(1) || 0} |
        Ship: {selectedIndex !== null ? ships[selectedIndex]?.id : "None"}
      </div>

      {/* Pellets */}
      {pellets.map((p) => (
        <div
          key={p.id}
          className="group absolute"
          style={{
            left: toPercent(p.x),
            top: toPercent(p.y),
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src="/visualizer/landing-fuel-1.svg"
            alt="pellet"
            className="h-6 w-6 transition-transform hover:scale-110"
          />
          <div className="absolute bottom-full left-1/2 z-50 mb-1 hidden -translate-x-1/2 transform rounded-md border border-gray-300 bg-black bg-opacity-70 px-2 py-1 text-xs text-white group-hover:block">
            ID: {p.id}, Fuel: {p.fuel}
            <br />({p.x.toFixed(1)}, {p.y.toFixed(1)})
          </div>
        </div>
      ))}

      {/* Asteria */}
      <img
        src="/visualizer/favicon.png"
        alt="asteria"
        className="absolute z-10 h-16 w-16 opacity-80"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Ships */}
      {ships.map((ship, index) => (
        <div
          key={ship.id}
          className="group absolute"
          style={{
            left: toPercent(ship.x),
            top: toPercent(ship.y),
            transform: "translate(-50%, -50%)",
            zIndex: index === selectedIndex ? 10 : 1,
          }}
        >
          <img
            src="/visualizer/landing-ship-1.svg"
            alt={`ship-${ship.id}`}
            onClick={() => handleShipClick(index)}
            className={`h-8 w-8 cursor-pointer transition-transform hover:scale-110 ${
              index === selectedIndex ? "ring-2 ring-yellow-400" : ""
            } ${ship.fuel <= 0 ? "opacity-50" : ""}`}
          />
          <div className="absolute bottom-full left-1/2 z-50 mb-1 hidden -translate-x-1/2 transform rounded-md border border-gray-300 bg-black bg-opacity-70 px-2 py-1 text-xs text-white group-hover:block">
            ID: {ship.id}, Fuel: {ship.fuel.toFixed(1)}
            <br />({ship.x.toFixed(1)}, {ship.y.toFixed(1)})
          </div>
        </div>
      ))}

      {/* Center marker */}
      <div
        className="pointer-events-none absolute z-10 h-[1%] w-[1%] border-2 border-gray-400"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <span className="absolute left-1/2 top-full -translate-x-1/2 transform text-xs text-green-400">
          (0, 0)
        </span>
      </div>

      {/* Quit Button */}
      <div className="absolute bottom-4 right-4 rounded-md bg-black bg-opacity-70 p-2">
        <button
          onClick={handleQuit}
          className="rounded-full bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
        >
          Restart
        </button>
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="rounded-lg bg-gray-900 p-8 text-center text-white shadow-xl">
            <h2 className="mb-4 text-3xl font-bold">Game Over</h2>
            <p className="mb-2 text-lg">Final Score: {score}</p>
            <p className="mb-6 text-sm">
              Ship {ships[selectedIndex!]?.id} ran out of fuel!
            </p>
            <button
              onClick={handleQuit}
              className="rounded-full bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              Start New Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStart;
