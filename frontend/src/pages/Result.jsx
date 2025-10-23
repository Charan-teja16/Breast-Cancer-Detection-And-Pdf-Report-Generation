import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Result() {
    const location = useLocation();
    const { prediction, confidence, report } = location.state || {};
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [showWhatsAppInput, setShowWhatsAppInput] = useState(false);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [emailSending, setEmailSending] = useState(false);
    const [whatsappSending, setWhatsappSending] = useState(false);
    const [message, setMessage] = useState("");

    // ✅ Email sender
    const handleSendEmail = async () => {
        if (!email) {
            setMessage("Please enter an email address");
            return;
        }
        setEmailSending(true);
        setMessage("");
        try {
            const response = await axios.post("http://127.0.0.1:8080/send-email", {
                email,
                report,
            });
            setMessage(response.data.message);
            setShowEmailInput(false);
            setEmail("");
        } catch (error) {
            console.error(error);
            setMessage("Failed to send email. Please try again.");
        } finally {
            setEmailSending(false);
        }
    };

    // ✅ WhatsApp sender
    const handleSendWhatsApp = async () => {
        if (!phone) {
            setMessage("Please enter phone number with country code (e.g. +91XXXXXXXXXX)");
            return;
        }
        setWhatsappSending(true);
        setMessage("");
        try {
            const response = await axios.post("http://127.0.0.1:8080/send-whatsapp", {
                phone,
                report,
            });
            setMessage(response.data.message);
            setShowWhatsAppInput(false);
            setPhone("");
        } catch (error) {
            console.error(error);
            setMessage("Failed to send WhatsApp message. Please try again.");
        } finally {
            setWhatsappSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Results</h1>
                    <p className="text-lg text-gray-600">Detailed report of your breast cancer detection analysis</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
                    <div className="p-8">
                        {prediction !== undefined && report ? (
                            <>
                                {/* Result Summary */}
                                <div className={`p-6 rounded-lg mb-8 ${prediction === 1 ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 p-3 rounded-full ${prediction === 1 ? "bg-red-100" : "bg-green-100"}`}>
                                            {prediction === 1 ? (
                                                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            ) : (
                                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {prediction === 1 ? "IDC Present (Malignant)" : "No Cancer (Benign)"}
                                            </h3>
                                            <p className="text-sm text-gray-600">Confidence: {confidence}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Show Report Image */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Visual Analysis</h3>
                                    <div className="border rounded-lg overflow-hidden shadow-md">
                                        <img
                                            src={`http://127.0.0.1:8080${report.replace(".pdf", ".png")}`}
                                            alt="Report Preview"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Share Results</h3>
                                    
                                    {/* Download */}
                                    <a
                                        href={`http://127.0.0.1:8080/download-report?report=${report}`}
                                        className="flex items-center justify-between w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md"
                                    >
                                        <span className="flex items-center">
                                            <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download Full Report
                                        </span>
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </a>

                                    {/* Email */}
                                    {showEmailInput ? (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="mb-3">
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="Enter recipient email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                            <button
                                                onClick={handleSendEmail}
                                                disabled={emailSending}
                                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-75 flex items-center justify-center"
                                            >
                                                {emailSending ? (
                                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : null}
                                                {emailSending ? "Sending..." : "Send via Email"}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowEmailInput(true)}
                                            className="flex items-center justify-between w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
                                        >
                                            <span className="flex items-center">
                                                <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                Send via Email
                                            </span>
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    )}

                                    {/* WhatsApp */}
                                    {showWhatsAppInput ? (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="mb-3">
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter WhatsApp number (e.g. +91XXXXXXXXXX)"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                            <button
                                                onClick={handleSendWhatsApp}
                                                disabled={whatsappSending}
                                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 disabled:opacity-75 flex items-center justify-center"
                                            >
                                                {whatsappSending ? (
                                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : null}
                                                {whatsappSending ? "Sending..." : "Send via WhatsApp"}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowWhatsAppInput(true)}
                                            className="flex items-center justify-between w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md"
                                        >
                                            <span className="flex items-center">
                                                <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>
                                                Send via WhatsApp
                                            </span>
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {message && (
                                    <div className={`mt-6 p-4 rounded-md ${message.includes("Failed") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>
                                        <div className="flex items-center">
                                            {message.includes("Failed") ? (
                                                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            <p className="text-sm font-medium">{message}</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
                                <p className="mt-2 text-sm text-gray-600">Please upload an image for analysis first.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Result;