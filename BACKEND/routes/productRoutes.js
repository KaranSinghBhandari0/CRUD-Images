const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');
const Product = require('../models/Product');
const router = express.Router();
const path = require("path");

// Multer config
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);  
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});

// Create Product
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);

        const product = new Product({
            name: req.body.name,
            image: result.secure_url,
            cloudinary_id: result.public_id,
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Product
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(product.cloudinary_id);

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path);
            product.image = result.secure_url;
            product.cloudinary_id = result.public_id;
        }

        product.name = req.body.name || product.name; // Only update if new name is provided
        await product.save();

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(product.cloudinary_id);

        res.status(200).send({ message: "product deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get product by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id); // Fetch the product from the database
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({product}); // Send the product data as a response
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

