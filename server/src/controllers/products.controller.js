const prisma = require('../lib/prisma');

async function list(req, res, next) {
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
}

async function get(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, get };
