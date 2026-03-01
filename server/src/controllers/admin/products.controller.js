const prisma = require('../../lib/prisma');

function validatePrice(price) {
  if (typeof price !== 'number' || price < 0) return 'Price must be a non-negative number';
  return null;
}

async function create(req, res, next) {
  try {
    const { name, description, price, category, inStock, quantity, imageUrl } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    const priceError = validatePrice(price);
    if (priceError) return res.status(400).json({ error: priceError });

    const product = await prisma.product.create({
      data: { name, description, price, category, inStock, quantity, imageUrl },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const { name, description, price, category, inStock, quantity, imageUrl } = req.body;

    if (price !== undefined) {
      const priceError = validatePrice(price);
      if (priceError) return res.status(400).json({ error: priceError });
    }

    const product = await prisma.product.update({
      where: { id },
      data: { name, description, price, category, inStock, quantity, imageUrl },
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, update, remove };
