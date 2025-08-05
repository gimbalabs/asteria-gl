import { useQuitShip } from "~/hooks/useQuitShip";
import { AssetExtended } from "@meshsdk/core";

export default function Quit({pilot}: {pilot: AssetExtended | null}) {
    const { handleQuitShip } = useQuitShip(pilot);
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