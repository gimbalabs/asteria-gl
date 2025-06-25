import { useMoveShip } from "~/hooks/useMoveShip";
import { useElapsedSeconds } from "~/hooks/useElapsedSeconds";



export default function MoveShipComponent() {
    const { shipState, shipStateDatum } = useMoveShip();
    const {secs, possibleSteps} = useElapsedSeconds(shipStateDatum?.posixTime, shipStateDatum?.fuel);

    return (
        <div>
            <h1>Move Ship</h1>
            <button onClick={shipState} style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}>Get Ship Details</button>
            <div>
                <p>Create a table with the following data:</p>
                <p>1. Fuel: {shipStateDatum?.fuel}</p>
                <p>2. Coordinate X: {shipStateDatum?.coordinateX}</p>
                <p>3. Coordinate Y: {shipStateDatum?.coordinateY}</p>
                <p>4. Ship Name: {shipStateDatum?.shipName}</p>
                <p>5. Pilot Name: {shipStateDatum?.pilotName}</p>
                <p>6. Time Elapsed: {secs}</p>
                <p>7. Possible Steps: {possibleSteps}</p>
            </div>
        </div>
    );
}