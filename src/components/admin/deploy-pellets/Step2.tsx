import { useState } from "react";
import { PelletParams, parsePelletsCSV } from "~/utils/pelletUtils";


export default function Step2({ setPellets }: { setPellets: (pellets: PelletParams) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isParsing, setIsParsing] = useState(false);

    // Handle drag events
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
                handleFile(droppedFile);
            }
        }
    };

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                handleFile(selectedFile);
            }
        }
    };

    // Process the selected file
    const handleFile = (selectedFile: File) => {
        if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
            setError("Please upload a CSV file");
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setError(null);
        parseCSV(selectedFile);
    };

    // Parse CSV and update pellets
    const parseCSV = async (csvFile: File) => {
        setIsParsing(true);
        
        try {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const csvContent = e.target?.result as string;
                    const parsedPellets = parsePelletsCSV(csvContent);
                    setPellets(parsedPellets);
                    console.log(parsedPellets);
                    setIsParsing(false);
                    setError(null);
                } catch (err) {
                    setError("Failed to parse CSV file. Make sure it has the correct format.");
                    setIsParsing(false);
                }
            };
            
            reader.onerror = () => {
                setError("Failed to read file");
                setIsParsing(false);
            };
            
            reader.readAsText(csvFile);
        } catch (err) {
            setError("An error occurred while processing the file");
            setIsParsing(false);
        }
    };

    // Add a big white box to upload the CSV file
    // File can be dragged and dropped or if clicked it gives option to upload from local
    // if uploaded, the pellets variable is updated with the data from the CSV file
    return (
        <div className="w-full">
            {/* File upload container */}
            <div 
                className={`
                    w-full 
                    p-8 
                    mt-10
                    mb-10
                    border-2 
                    border-dashed 
                    rounded-lg 
                    text-center 
                    cursor-pointer
                    transition-colors
                    ${isDragging ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-300'}
                    ${error ? 'border-red-500' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
            >
                {isParsing ? (
                    <p className="text-gray-500">Processing file...</p>
                ) : file ? (
                    <div>
                        <p className="text-green-600 font-semibold mb-2">File uploaded & pellets updated: {file.name}</p>
                        <button 
                            className="text-sm text-blue-500 hover:underline"
                            onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                                setPellets([]);
                                // Reset the file input value
                                const fileInput = document.getElementById('file-input') as HTMLInputElement;
                                if (fileInput) fileInput.value = '';
                            }}
                        >
                            Remove file
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-500 mb-2">
                            Drag and drop your CSV file here, or click to browse
                        </p>
                        <p className="text-gray-400 text-sm">
                            The CSV should contain pellet data with pos_x, pos_y, and fuel fields
                        </p>
                        <p className="text-gray-400 text-sm italic">
                            Note: This is an optional step if you refreshed the page or want to upload a different CSV file
                        </p>
                    </div>
                )}
                
                {/* Hidden file input */}
                <input 
                    id="file-input"
                    type="file" 
                    accept=".csv"
                    className="hidden" 
                    onChange={handleFileInputChange}
                />
            </div>
            
            {/* Error message */}
            {error && (
                <p className="text-red-500 mt-2">{error}</p>
            )}
        </div>
    )
}