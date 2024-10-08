import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateProduct() {
    const { id } = useParams();
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [data, setData] = useState({
        name: '',
        image: null,
    });

    useEffect(() => {
        const fetchProduct = () => {
            axios.get(`http://localhost:5000/api/products/${id}`)
                .then(response => {
                    setProduct(response.data.product);
                    setData({
                        name: response.data.product.name,
                        image: null,
                    });
                })
                .catch(error => {
                    console.error('Error fetching product details:', error);
                });
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setData(prevData => ({ ...prevData, image: files[0] }));
        } else {
            setData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.image) {
            formData.append('image', data.image);
        }
        
        setUpdating(true);
        try {
            await axios.put(`http://localhost:5000/api/products/${product._id}`, formData);
            alert('Product updated successfully!');
            navigate('/');
        } catch (error) {
            alert('Failed to update Product');
            console.error('Error saving product:', error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div>
            <h2>Update Product</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    required
                />
                {product.image && (
                    <div>
                        <p>Current Image:</p>
                        <img src={product.image} alt="Existing Product" style={{ height: '100px', width: '100px' }} />
                    </div>
                )}
                <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                />
                <button type="submit" disabled={updating}>
                    {updating ? 'Updating...' : 'Update'}
                </button>
            </form>
        </div>
    );
}
