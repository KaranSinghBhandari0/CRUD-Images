import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function NewProduct() {
    const [formData, setFormData] = useState({
        name: '',
        image: null,
    });
    const [adding, setAdding] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        submissionData.append('name', formData.name);
        submissionData.append('image', formData.image);

        setAdding(true); // Start loading state
        try {
            // Create new product
            await axios.post('http://localhost:5000/api/products', submissionData);
            setFormData({ name: '', image: null });
            alert('Product added successfully!');
            navigate('/'); // Navigate to home after successful submission
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save the product. Please try again.');
        } finally {
            setAdding(false); // Stop loading state
        }
    };

    return (
        <>
            <h2>Add a new Product</h2>
                <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={adding}>
                    {adding ? 'Adding...' : 'Add Product'}
                </button>
            </form>
        </>
    );
}
