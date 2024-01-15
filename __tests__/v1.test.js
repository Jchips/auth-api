'use strict';

const { server } = require('../src/server');
const supertest = require('supertest');
const { db, food } = require('../src/models');
// const { users } = require('../src/auth/models');
const request = supertest(server);

// let person;
// let person2;

beforeAll(async () => {
  await db.sync();
  // person = await users.create({
  //   username: 'fox',
  //   password: 'password123',
  //   role: 'admin',
  // });
  // person2 = await users.create({
  //   username: 'goat',
  //   password: 'password123',
  //   role: 'user',
  // });
  await food.create({
    name: 'pear',
    calories: 7,
    type: 'fruit',
  });
  await food.create({
    name: 'lettuce',
    calories: 8,
    type: 'vegetable',
  });
});

afterAll(async () => {
  await db.drop();
});

describe('Access control', () => {
  test('returns a list of food items or a single food item from given ID', async () => {
    let response = await request.get('/api/v1/food');
    let response2 = await request.get('/api/v1/food/1');

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(2);
    expect(response2.status).toEqual(200);
    expect(response2.body.name).toEqual('pear');
  });

  test('adds an item to the DB and returns an object with the added item', async () => {
    let object = {
      name: 'cheese',
      calories: 100,
      type: 'protein',
    };
    let response = await request.post('/api/v1/food').send(object);

    expect(response.status).toBe(201);
    expect(response.body.name).toEqual('cheese');
  });

  test('returns a single, updated item by ID.', async () => {
    let object = {
      name: 'cheese',
      calories: 90,
      type: 'protein',
    };
    let response = await request.put('/api/v1/food/3').send(object);

    expect(response.status).toBe(200);
    expect(response.body.calories).toEqual(90);
  });

  test('returns an empty object. Subsequent GET for the same ID should result in nothing found.', async () => {
    let response = await request.delete('/api/v1/food/3');
    let response2 = await request.get('/api/v1/food/3');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(1);
    expect(response2.body).toBeNull;
  });
});