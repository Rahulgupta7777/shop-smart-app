const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/lib/prisma');

beforeAll(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Auth API', () => {
  describe('POST /api/auth/signup', () => {
    it('first signup becomes ADMIN', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'owner@moji.test', password: 'password123', name: 'Owner' });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.role).toBe('ADMIN');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('second signup becomes CUSTOMER', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'buyer@moji.test', password: 'password123' });
      expect(res.statusCode).toEqual(201);
      expect(res.body.user.role).toBe('CUSTOMER');
    });

    it('rejects duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'owner@moji.test', password: 'password123' });
      expect(res.statusCode).toEqual(409);
    });

    it('rejects short password', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'short@moji.test', password: 'abc' });
      expect(res.statusCode).toEqual(400);
    });

    it('rejects invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'not-an-email', password: 'password123' });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'owner@moji.test', password: 'password123' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.role).toBe('ADMIN');
    });

    it('rejects wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'owner@moji.test', password: 'wrongpass' });
      expect(res.statusCode).toEqual(401);
    });

    it('rejects unknown email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nope@moji.test', password: 'password123' });
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('rejects missing token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toEqual(401);
    });

    it('rejects invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer not-a-real-token');
      expect(res.statusCode).toEqual(401);
    });

    it('returns user for valid token', async () => {
      const login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'owner@moji.test', password: 'password123' });
      const token = login.body.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.user.email).toBe('owner@moji.test');
      expect(res.body.user).not.toHaveProperty('password');
    });
  });
});
