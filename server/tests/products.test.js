const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/lib/prisma');

let adminToken;
let customerToken;

beforeAll(async () => {
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const adminRes = await request(app)
    .post('/api/auth/signup')
    .send({ email: 'admin@example.com', password: 'password123', name: 'Admin' });
  adminToken = adminRes.body.token;

  const custRes = await request(app)
    .post('/api/auth/signup')
    .send({ email: 'customer@example.com', password: 'password123', name: 'Customer' });
  customerToken = custRes.body.token;
});

afterAll(async () => {
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Products API', () => {
  let productId;

  describe('POST /api/admin/products (admin-only)', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .send({ name: 'Anon Product', price: 10, category: 'Tees' });
      expect(res.statusCode).toEqual(401);
    });

    it('should reject non-admin users with 403', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ name: 'Forbidden Product', price: 10, category: 'Tees' });
      expect(res.statusCode).toEqual(403);
    });

    it('should create a new product with admin token', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product',
          description: 'A test product',
          price: 19.99,
          category: 'Tees',
          inStock: true,
          quantity: 10,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Test Product');
      expect(res.body.price).toBe(19.99);
      expect(res.body.category).toBe('Tees');
      productId = res.body.id;
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 10, category: 'Tees' });
      expect(res.statusCode).toEqual(400);
    });

    it('should return 400 if price is missing', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'No Price', category: 'Tees' });
      expect(res.statusCode).toEqual(400);
    });

    it('should return 400 if category is missing', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'No Cat', price: 5 });
      expect(res.statusCode).toEqual(400);
    });

    it('should return 400 if price is negative', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Neg', price: -5, category: 'Tees' });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/products (public)', () => {
    it('returns all products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('filters by category', async () => {
      const res = await request(app).get('/api/products?category=Tees');
      expect(res.statusCode).toEqual(200);
      res.body.forEach((p) => expect(p.category).toBe('Tees'));
    });

    it('searches by name', async () => {
      const res = await request(app).get('/api/products?search=Test');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/products/:id (public)', () => {
    it('returns a single product', async () => {
      const res = await request(app).get(`/api/products/${productId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toBe(productId);
    });

    it('returns 404 for non-existent product', async () => {
      const res = await request(app).get('/api/products/99999');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PUT /api/admin/products/:id (admin-only)', () => {
    it('updates a product with admin token', async () => {
      const res = await request(app)
        .put(`/api/admin/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Product', price: 29.99 });

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe('Updated Product');
      expect(res.body.price).toBe(29.99);
    });

    it('rejects without token', async () => {
      const res = await request(app)
        .put(`/api/admin/products/${productId}`)
        .send({ name: 'Nope' });
      expect(res.statusCode).toEqual(401);
    });

    it('returns 404 for non-existent product', async () => {
      const res = await request(app)
        .put('/api/admin/products/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Nope' });
      expect(res.statusCode).toEqual(404);
    });

    it('returns 400 for negative price', async () => {
      const res = await request(app)
        .put(`/api/admin/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: -10 });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('DELETE /api/admin/products/:id (admin-only)', () => {
    it('deletes a product with admin token', async () => {
      const res = await request(app)
        .delete(`/api/admin/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(204);
    });

    it('returns 404 for already deleted product', async () => {
      const res = await request(app)
        .delete(`/api/admin/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(404);
    });
  });
});
