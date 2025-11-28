import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import componentService from '../../services/api/componentService';
import '../../styles/globals.css';

const AddComponentForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [condition, setCondition] = useState('used');
    const [price, setPrice] = useState('');
    const [imageFile, setImageFile] = useState(null); // State for the image file
    const [previewUrl, setPreviewUrl] = useState(''); // State for image preview
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => state.auth);

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Show preview
        } else {
            setImageFile(null);
            setPreviewUrl('');
        }
    };

    // Reset form fields
    const resetForm = () => {
        setName('');
        setDescription('');
        setCondition('used');
        setPrice('');
        setImageFile(null);
        setPreviewUrl('');
        // Also reset the file input visually if needed
        const fileInput = document.getElementById('image');
        if (fileInput) fileInput.value = "";
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!user || !user.token) {
            setError('You must be logged in to sell an item.');
            setLoading(false);
            return;
        }
        if (!name || !price || !condition) {
             setError('Please fill in Name, Condition, and Price.');
             setLoading(false);
             return;
        }

        // --- Use FormData for file upload ---
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('condition', condition);
        formData.append('price', price);
        if (imageFile) {
            // 'image' must match the field name in backend's upload.single('image')
            formData.append('image', imageFile);
        }
        // --- End FormData ---

        try {
            // Pass FormData and token to the service
            await componentService.createComponent(formData, user.token);

            setSuccess('Component listed successfully!');
            resetForm(); // Clear the form

        } catch (err) {
            setError(err.toString() || 'Failed to list component.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <h2>List a Component for Sale</h2>
            {/* Set form encoding type */}
            <form onSubmit={onSubmit} encType="multipart/form-data">
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

                <div className="form-group">
                    <label htmlFor="name">Component Name</label>
                    <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., iPhone 12 Screen" required />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description (Optional)</label>
                    <input type="text" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                {/* --- Image Upload Input --- */}
                <div className="form-group">
                    <label htmlFor="image">Image (Optional)</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ border: '1px dashed #ccc', padding: '10px' }}
                    />
                    {/* Image Preview */}
                    {previewUrl && (
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <img src={previewUrl} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #eee' }} />
                        </div>
                    )}
                </div>
                {/* --- End Image Upload --- */}

                <div className="form-group">
                    <label htmlFor="condition">Condition</label>
                    <select id="condition" name="condition" value={condition} onChange={(e) => setCondition(e.target.value)}>
                        <option value="used">Used</option>
                        <option value="new">New</option>
                        <option value="refurbished">Refurbished</option>
                        <option value="for-parts">For Parts</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input type="number" id="price" name="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 25.00" step="0.01" min="0" required />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Listing Item...' : 'List My Item'}
                </button>
            </form>
        </div>
    );
};

export default AddComponentForm;