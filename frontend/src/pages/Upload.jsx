import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Upload() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState("");
    const [predictionData, setPredictionData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const navigate = useNavigate();

    // Common symptoms associated with breast cancer
    const symptomsList = [
        "Lump or mass in the breast",
        "Change in breast size or shape",
        "Nipple discharge (other than breast milk)",
        "Nipple inversion or retraction",
        "Skin changes (redness, dimpling, puckering)",
        "Breast pain or tenderness",
        "Swelling in the armpit or around the collarbone",
        "Nipple rash or crusting",
        "Unexplained weight loss",
        "Persistent fatigue"
    ];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        
        // Check if file is an image
        if (!selectedFile.type.startsWith('image/')) {
            setError("Please select an image file (PNG, JPG, JPEG)");
            return;
        }
        
        // Create an image object to check dimensions
        const img = new Image();
        img.onload = function() {
            if (this.width === 50 && this.height === 50) {
                setFile(selectedFile);
                setResult("");
                setError("");
            } else {
                setError("Invalid Image,Upload Clear Picture");
                setFile(null);
                // Clear the file input
                e.target.value = '';
            }
        };
        img.onerror = function() {
            setError("Invalid image file");
            setFile(null);
        };
        img.src = URL.createObjectURL(selectedFile);
    };

    const handleSymptomChange = (e) => {
        const options = e.target.options;
        const selectedValues = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value);
            }
        }
        setSelectedSymptoms(selectedValues);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a valid 50x50px image file first");
            return;
        }

        setLoading(true);
        setError("");

        const username = localStorage.getItem("username");
        const phone = localStorage.getItem("phone");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("username", username);
        formData.append("phone", phone);
        formData.append("symptoms", JSON.stringify(selectedSymptoms));

        try {
            const response = await axios.post("http://127.0.0.1:8080/predict", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Prediction Response:", response.data);
            setPredictionData(response.data);

            // Enhanced result logic considering both image analysis and symptoms
            let finalResult = "";
            if (response.data?.prediction === 0) {
                if (selectedSymptoms.length > 0) {
                    finalResult = "No Cancer detected in image, but symptoms present. Please consult a doctor.";
                } else {
                    finalResult = "No Cancer (Benign)";
                }
            } else if (response.data?.prediction === 1) {
                if (selectedSymptoms.length > 0) {
                    finalResult = "IDC Present (Malignant) with symptoms. Urgent consultation recommended.";
                } else {
                    finalResult = "IDC Present (Malignant)";
                }
            } else {
                finalResult = "Error in prediction";
            }
            
            setResult(finalResult);
        } catch (error) {
            console.log(error);
            setError("Error in prediction process. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewResults = () => {
        if (predictionData) {
            // Include symptoms in the data passed to the result page
            const resultData = {
                ...predictionData,
                symptoms: selectedSymptoms
            };
            navigate("/result", { state: resultData });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Cancer Detection Analysis</h1>
                    <p className="text-lg text-gray-600">Upload a medical image for breast cancer detection</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                    <div className="p-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="rounded-full bg-blue-100 p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex items-center justify-center">
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
                                    </div>
                                    <input 
                                        id="dropzone-file" 
                                        type="file" 
                                        className="hidden" 
                                        onChange={handleFileChange}
                                        accept="image/png, image/jpeg" 
                                        required
                                    />
                                </label>
                            </div>

                            {/* Symptoms Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Select any symptoms you're experiencing (optional):
                                </label>
                                <select 
                                    multiple 
                                    value={selectedSymptoms}
                                    onChange={handleSymptomChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md h-32"
                                >
                                    {symptomsList.map((symptom, index) => (
                                        <option key={index} value={symptom}>
                                            {symptom}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500">
                                    Hold Ctrl/Cmd to select multiple symptoms
                                </p>
                                {selectedSymptoms.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-700">Selected symptoms:</p>
                                        <ul className="list-disc list-inside text-sm text-gray-600">
                                            {selectedSymptoms.map((symptom, index) => (
                                                <li key={index}>{symptom}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {file && (
                                <div className="rounded-md bg-blue-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm text-blue-700">
                                                Selected file: <span className="font-medium">{file.name}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !file}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing image...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <svg className="h-5 w-5 text-indigo-300 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        Analyze Image
                                    </span>
                                )}
                            </button>
                        </form>

                        {result && (
                            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Result</h3>
                                <div className={`p-4 rounded-md ${result.includes("No Cancer") && !result.includes("symptoms present") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                    <div className="flex items-center">
                                        {result.includes("No Cancer") && !result.includes("symptoms present") ? (
                                            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        )}
                                        <p className="font-semibold">{result}</p>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleViewResults}
                                    className="mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
                                >
                                    View Detailed Results
                                    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Upload;