const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/lib/prisma');

beforeAll(async () => {
  // Clean the database before tests
  await prisma.product.deleteMany();
});

afterAll(async () => {
  await prisma.product.deleteMany();
  await prisma.$disconnect();
});

describe('Products CRUD API', () => {
  let productId;

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          description: 'A test product',
          price: 19.99,
          category: 'Electronics',
          inStock: true,
          quantity: 10,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Test Product');
      expect(res.body.price).toBe(19.99);
      expect(res.body.category).toBe('Electronics');
      productId = res.body.id;
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ price: 10, category: 'Electronics' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if price is missing', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'No Price', category: 'Electronics' });

      expect(res.statusCode).toEqual(400);
    });

    it('should return 400 if category is missing', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'No Cat', price: 5 });

      expect(res.statusCode).toEqual(400);
    });

    it('should return 400 if price is negative', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Neg', price: -5, category: 'Electronics' });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should filter by category', async () => {
      const res = await request(app).get('/api/products?category=Electronics');
      expect(res.statusCode).toEqual(200);
      res.body.forEach((p) => {
        expect(p.category).toBe('Electronics');
      });
    });

    it('should search by name', async () => {
      const res = await request(app).get('/api/products?search=Test');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
      const res = await request(app).get(`/api/products/${productId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toBe(productId);
      expect(res.body.name).toBe('Test Product');
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/api/products/99999');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .send({ name: 'Updated Product', price: 29.99 });

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe('Updated Product');
      expect(res.body.price).toBe(29.99);
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app)
        .put('/api/products/99999')
        .send({ name: 'Nope' });

      expect(res.statusCode).toEqual(404);
    });

    it('should return 400 for negative price', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .send({ price: -10 });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      const res = await request(app).delete(`/api/products/${productId}`);
      expect(res.statusCode).toEqual(204);
    });

    it('should return 404 for already deleted product', async () => {
      const res = await request(app).delete(`/api/products/${productId}`);
      expect(res.statusCode).toEqual(404);
    });
  });
});
