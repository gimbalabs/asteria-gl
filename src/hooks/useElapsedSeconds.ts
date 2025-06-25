import { useEffect, useState } from "react";
import { elapsedSeconds } from "~/utils/time";

const initialPossibleSteps = ((fuel: number, secs: number) => {
    if (Math.floor(secs / 30) <= fuel) {
      return (Math.floor(secs / 30));
    } else {
      return fuel;
    }
  });

export function useElapsedSeconds(startMs: number, fuel: number) {
  const [secs, setSecs] = useState(() => elapsedSeconds(startMs));
  const [possibleSteps, setPossibleSteps] = useState(initialPossibleSteps(fuel, secs));

  useEffect(() => {
    const id_1 = setInterval(() => setSecs(elapsedSeconds(startMs)), 1_000);
    const id_2 = setInterval(() => setPossibleSteps(initialPossibleSteps(fuel, secs)), 1_000);
    return () => {
      clearInterval(id_1);
      clearInterval(id_2);
    };          // cleanup
  }, [startMs]);

  return {secs, possibleSteps};                               // ← seconds only
}
