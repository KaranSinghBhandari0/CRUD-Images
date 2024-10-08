import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [deletingId, setDeletingId] = useState(null); // State to track the product ID being deleted

    // Fetch all products
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle delete
    const handleDelete = async (id) => {
        setDeletingId(id); // Set the ID of the product being deleted
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            fetchProducts(); // Refresh the product list after deletion
        } catch (error) {
            console.error('Error deleting product:', error);
        } finally {
            setDeletingId(null); // Reset deleting state
        }
    };

    return (
        <div>
            <h1>Product Management</h1>
            <Link to={'/new'}>Add a new Product</Link>
            <h2>Products List</h2>
            <ul>
                {products.map(product => (
                    <li key={product._id}>
                        <h3>{product.name}</h3>
                        <img src={product.image} alt={product.name} />
                        <Link to={`/update/${product._id}`}><button>Edit</button></Link>
                        <button onClick={() => handleDelete(product._id)}>
                            {deletingId === product._id ? 'Deleting...' : 'Delete'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
