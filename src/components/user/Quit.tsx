import { useQuitShip } from "~/hooks/useQuitShip";

export default function Quit() {
    const { handleQuitShip } = useQuitShip();
    return (
        <button onClick={handleQuitShip} style={{
            padding: "8px 16px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}>Quit Game</button>
    )
}