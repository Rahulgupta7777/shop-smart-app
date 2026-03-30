const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET all products
router.get('/', async (req, res, next) => {
  try {
    const { category, inStock, search, sort, order } = req.query;

    const where = {};
    if (category) where.category = category;
    if (inStock !== undefined) where.inStock = inStock === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const orderBy = {};
    if (sort) {
      orderBy[sort] = order === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const products = await prisma.product.findMany({ where, orderBy });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET single product
router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST create product
router.post('/', async (req, res, next) => {
  try {
    const { name, description, price, category, inStock, quantity, imageUrl } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Price must be a non-negative number' });
    }

    const product = await prisma.product.create({
      data: { name, description, price, category, inStock, quantity, imageUrl },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PUT update product
router.put('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const { name, description, price, category, inStock, quantity, imageUrl } = req.body;

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return res.status(400).json({ error: 'Price must be a non-negative number' });
    }

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, price, category, inStock, quantity, imageUrl },
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE product
router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
