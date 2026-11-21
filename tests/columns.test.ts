import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { Column } from '../src/models/Column.js';
import { createTestUser, getAuthToken, createTestColumn } from './helpers.js';
import './setup.js';

const app = createApp();

describe('Columns Routes', () => {
  let token: string;

  // les routes sont protégées : on crée un utilisateur et son token
  beforeEach(async () => {
    const user = await createTestUser();
    token = getAuthToken(user);
  });

  it('GET /api/columns renvoie la liste des colonnes', async () => {
    await createTestColumn('A faire', 0);
    await createTestColumn('En cours', 1);

    const res = await request(app)
      .get('/api/columns')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].name).toBe('A faire');
  });

  it('POST /api/columns crée une colonne en base', async () => {
    const res = await request(app)
      .post('/api/columns')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Contrôle qualité' });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Contrôle qualité');

    // la colonne est bien dans MongoDB
    const colonne = await Column.findOne({ name: 'Contrôle qualité' });
    expect(colonne).not.toBeNull();
  });

  it('POST /api/columns sans token renvoie 401', async () => {
    const res = await request(app).post('/api/columns').send({ name: 'Test' });

    expect(res.status).toBe(401);
  });
});
