'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const { sequelizeDatabase } = require('../src/models');
const userModel = require('../auth-server/src/auth/models/users');
const { describe } = require('node:test');
const request = supertest(app);

let person;

beforeAll(async () => {
  sequelizeDatabase.sync();
  person = await userModel.create({
    username: 'dog',
    password: 'password123',
    role: 'user',
  });
});

afterAll(async () => {
  sequelizeDatabase.drop();
});

describe('Access control', () => {
  test();
});