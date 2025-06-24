import { useMoveShip } from "~/hooks/useMoveShip";



export default function MoveShipComponent() {
    const { ShipStateDatum } = useMoveShip();

    return (
        <div>
            <h1>Move Ship</h1>
            <p>{ShipStateDatum.data?.length}</p>
        </div>
    );
}