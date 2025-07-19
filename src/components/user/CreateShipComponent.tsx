import { useWallet } from "@meshsdk/react";
import { useCreateShipTx } from "~/hooks/useCreateShip";

export default function CreateShipComponent() {
  const {
    shipFee,
    setShipFee,
    posX,
    setPosX,
    posY,
    setPosY,
    initialFuel,
    setInitialFuel,
    handleSubmit,
  } = useCreateShipTx();
  const { connected } = useWallet();

  if (!connected) {
    return (
      <h2 className="font-bold text-galaxy-danger">
        Please connect your wallet before Creating your ship
      </h2>
    );
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2 text-black"
      >
        <h2>
          Choose you coordinates and the Click the button to Create your Asteria
          Ship
        </h2>
        <input
          value={posX}
          placeholder="Enter the X Coordinate"
          onChange={(e) => {
            setPosX(Number(e.target.value));
          }}
        />
        `{" "}
        <input
          value={posY}
          placeholder="Enter the Y Coordinate"
          onChange={(e) => {
            setPosY(Number(e.target.value));
          }}
        />
        <button
          type="submit"
          className={`inline-block rounded-lg px-6 py-3 font-semibold text-white shadow-md focus:outline-none focus:ring-2`}
        >
          Create ship
        </button>
      </form>
    </div>
  );
}
