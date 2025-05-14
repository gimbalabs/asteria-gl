import { PelletParams, getRingAreaSample, pelletsToCSV} from "~/utils/pelletUtils";
import { useState } from "react";


// 2. generate pellets + CSV file
export default function GetPelletsAndCsv({setPellets}: {setPellets: (pellets: PelletParams) => void}) {


    const [innerRadius, setInnerRadius] = useState<number | null>(null);
    const [outerRadius, setOuterRadius] = useState<number | null>(null);
    const [minFuel, setMinFuel] = useState<number | null>(null);
    const [maxFuel, setMaxFuel] = useState<number | null>(null);
    const [density, setDesnsity] = useState<number | null>(null);
    // Add validation errors state
    const [errors, setErrors] = useState({
        radius: false,
        fuel: false,
        density: false
    });

    
    // Validation function
    const validateInputs = () => {
        const newErrors = {
            radius: innerRadius !== null && outerRadius !== null && innerRadius >= outerRadius,
            fuel: minFuel !== null && maxFuel !== null && minFuel >= maxFuel,
            density: density !== null && (density <= 0 || density > 1)
        };
        
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const downloadCSV = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        
        if (validateInputs()) {
            // Build message and check if using defaults in one pass
            const defaultMessages = [];
            if (innerRadius === null) defaultMessages.push("• Inner Radius: 10");
            if (outerRadius === null) defaultMessages.push("• Outer Radius: 30");
            if (minFuel === null) defaultMessages.push("• Min Fuel: 5");
            if (maxFuel === null) defaultMessages.push("• Max Fuel: 30");
            if (density === null) defaultMessages.push("• Density: 0.5");
            
            // Show alert only if we have any default messages
            if (defaultMessages.length > 0) {
                alert("Using default values for missing parameters:\n" + defaultMessages.join("\n"));
            }
            
            // Generate pellets on demand
            const newPellets = getRingAreaSample(
                innerRadius ?? 10, 
                outerRadius ?? 30, 
                minFuel ?? 5, 
                maxFuel ?? 30, 
                density ?? 0.5
            );
            setPellets(newPellets);
            
            // Generate CSV and download
            const pelletsCSV = pelletsToCSV(newPellets);
            const blob: Blob = new Blob([pelletsCSV], { type: 'text/csv' });
            const url: string = window.URL.createObjectURL(blob);
            const a: HTMLAnchorElement = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', 'pellets.csv');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up the URL object to avoid memory leaks
            window.URL.revokeObjectURL(url);
        }
    };


    return (
        <div>
            <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <input placeholder="Inner Radius" 
                                className="placeholder:text-gray-400 text-black w-full" 
                                type="number" 
                                value={innerRadius === null ? "" : innerRadius} 
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value > 0) {
                                        setInnerRadius(value);
                                    } else if (e.target.value === "") {
                                        setInnerRadius(null);
                                    }
                                }} />
                        {errors.radius && <p className="text-red-500 text-sm mt-1">Inner radius must be less than outer radius</p>}
                    </div>
                    <div>
                        <input placeholder="Outer Radius" 
                                className="placeholder:text-gray-400 text-black w-full" 
                                type="number" 
                                value={outerRadius === null ? "" : outerRadius} 
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value > 0) {
                                        setOuterRadius(value);
                                    } else if (e.target.value === "") {
                                        setOuterRadius(null);
                                    }
                                }} />
                    </div>
                    <div>
                        <input placeholder="Min Fuel" 
                                className="placeholder:text-gray-400 text-black w-full" 
                                type="number" value={minFuel === null ? "" : minFuel} 
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value > 0) {
                                        setMinFuel(value);
                                    } else if (e.target.value === "") {
                                        setMinFuel(null);
                                    }
                                }} />
                        {errors.fuel && <p className="text-red-500 text-sm mt-1">Min fuel must be less than max fuel</p>}
                    </div>
                    <div>
                        <input placeholder="Max Fuel" 
                                className="placeholder:text-gray-400 text-black w-full" 
                                type="number" value={maxFuel === null ? "" : maxFuel} 
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value > 0) {
                                        setMaxFuel(value);
                                    } else if (e.target.value === "") {
                                        setMaxFuel(null);
                                    }
                                }} />
                    </div>
                    <div>
                        <input placeholder="1 >= Density > 0" 
                                className="placeholder:text-gray-400 text-black w-full" 
                                type="number" value={density === null ? "" : density} 
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value > 0 && value <= 1) {
                                        setDesnsity(value);
                                    } else if (e.target.value === "") {
                                        setDesnsity(null);
                                    }
                                }} />
                        {errors.density && <p className="text-red-500 text-sm mt-1">Density must be between 0 and 1</p>}
                    </div>
                </div>
                <button onClick={downloadCSV}
                className={`inline-block 
                            px-6 
                            py-3 
                            text-white 
                            font-semibold 
                            rounded-lg 
                            shadow-md 
                            focus:outline-none 
                            focus:ring-2 
                            bg-blue-500
                            mt-6
                            mb-10`}
                >Download CSV (optional)</button>
            </form>
        </div>
    );
    
    };