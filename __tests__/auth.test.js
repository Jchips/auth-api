'use strict';

const { server } = require('../src/server');
const supertest = require('supertest');
const { db } = require('../src/models');
const { users } = require('../src/auth/models');
const request = supertest(server);

let person = {
  username: 'goat',
  password: 'password123',
};
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
});

afterAll(async () => {
  await db.drop();
});

describe('Auth', () => {
  test('/signup creates a new user and sends an object with the user and the token to the client.', async () => {
    let response = await request.post('/signup').send(person);

    expect(response.status).toEqual(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.id).toBeDefined();
    expect(response.body.user.username).toEqual(person.username);
  });

  test('/signin with basic authentication headers logs in a user and sends an object with the user and the token to the client', async () => {
    let response = await request.post('/signin').auth(person.username, person.password);

    expect(response.status).toEqual(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.id).toBeDefined();
    expect(response.body.user.username).toEqual(person.username);
  });

  test('handles bad routes', async () => {
    let response = await request.post('/foo');

    expect(response.status).toBe(404);
  });

  it('basic fails with unknown user', async () => {
    const response = await request.post('/signin').auth('test', 'banana');

    expect(response.status).toBe(403);
    expect(response.text).toEqual('Invalid Login');
    expect(response.body.user).not.toBeDefined();
    expect(response.body.token).not.toBeDefined();
  });
});