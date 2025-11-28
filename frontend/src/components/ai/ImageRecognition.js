import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import aiService from '../../services/api/aiService';
import '../../styles/globals.css'; // Assuming styles are here

const ImageRecognition = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null); // Ref to reset file input

    // Get user token for authentication
    const { user } = useSelector((state) => state.auth);

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Create a temporary URL for image preview
            setPreviewUrl(URL.createObjectURL(file));
            setAnalysisResult(null); // Clear previous results
            setError('');
        }
    };

    // Handle image analysis submission
    const handleAnalyze = async () => {
        if (!selectedFile) {
            setError('Please select an image file first.');
            return;
        }
        if (!user || !user.token) {
            setError('Please log in to analyze images.');
            return;
        }

        setError('');
        setIsLoading(true);
        setAnalysisResult(null);

        try {
            const response = await aiService.analyzeImage(selectedFile, user.token);
            setAnalysisResult(response.data.analysis);
        } catch (err) {
            setError(err.toString() || 'Failed to analyze image.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle clearing the selection
    const handleClear = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setAnalysisResult(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the file input visually
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '700px', margin: '2rem auto', textAlign: 'center' }}>
            <h2>Identify E-waste Component</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Upload an image of an electronic component to get recycling suggestions.</p>

            {/* File Input */}
            <div className="form-group" style={{ marginBottom: '1rem' }}>
                <input
                    type="file"
                    accept="image/*" // Accept only image files
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px',
                        border: '1px dashed #ccc',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                />
            </div>

            {/* Image Preview */}
            {previewUrl && (
                <div style={{ marginBottom: '1.5rem', border: '1px solid #eee', padding: '10px', borderRadius: '8px' }}>
                    <img
                        src={previewUrl}
                        alt="Selected component preview"
                        style={{ maxWidth: '100%', maxHeight: '250px', display: 'block', margin: '0 auto' }}
                    />
                </div>
            )}

            {/* Action Buttons */}
            {selectedFile && (
                 <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button onClick={handleAnalyze} disabled={isLoading} style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
                        {isLoading ? 'Analyzing...' : 'Analyze Image'}
                    </button>
                    <button onClick={handleClear} disabled={isLoading} style={{ width: 'auto', padding: '0.75rem 1.5rem', backgroundColor: '#6c757d' }}>
                        Clear Selection
                    </button>
                 </div>
            )}

            {/* Error Message */}
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

            {/* Analysis Results */}
            {analysisResult && (
                <div style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                    textAlign: 'left'
                 }}>
                    <h3 style={{ marginTop: 0, color: '#007bff' }}>Analysis Results:</h3>
                    <p><strong>Identified Object:</strong> {analysisResult.identifiedObject} (Confidence: {(analysisResult.confidence * 100).toFixed(1)}%)</p>
                    <p><strong>Possible Materials:</strong> {analysisResult.materials.join(', ')}</p>
                    <p><strong>Suggestion:</strong> {analysisResult.recyclingSuggestion}</p>
                </div>
            )}
        </div>
    );
};

export default ImageRecognition;