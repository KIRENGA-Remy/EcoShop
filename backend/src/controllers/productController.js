import asyncHandler from 'express-async-handler';
import { Op } from 'sequelize';
import Product from '../models/productModel.js';

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, category, countInStock } = req.body;
  // console.log(" naming", name," pricing", price,"descr", description,"imag", image," catego", category," count is stock", countInStock);
  
    const product = await Product.create({
      name,
      price,
      description,
      image,
      category, 
      countInStock
    });
  
    res.status(201).json(product);
  });
  
// @desc    Fetch all products with pagination and search
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword || '';
  const category = req.query.category || '';

  // Build filter conditions
  const filterConditions = {};
  
  if (keyword) {
    filterConditions.name = { [Op.iLike]: `%${keyword}%` };
  }
  
  if (category) {
    filterConditions.category = category;
  }

  // Get total count
  const count = await Product.count({ where: filterConditions });
  
  // Get products with pagination
  const products = await Product.findAll({
    where: filterConditions,
    limit: pageSize,
    offset: pageSize * (page - 1),
    order: [['createdAt', 'DESC']]
  });

  // Send response with pagination info
  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    totalProducts: count
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;

  const product = await Product.findByPk(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (product) {
    await product.destroy();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});