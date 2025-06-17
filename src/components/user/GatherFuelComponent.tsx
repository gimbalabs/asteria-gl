import { useGatherFuelTx } from "~/hooks/useGatherFuel";


export default function GatherFuel(){

    const {handleSubmit, test} = useGatherFuelTx()

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <button type="submit">Click to test</button>
            </form>
            <pre className="text-white">{JSON.stringify({test})}</pre>
        </div>
    )

}