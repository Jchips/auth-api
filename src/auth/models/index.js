'use strict';

const userModel = require('./users.js');
const { db } = require('../../models');
const DataTypes = require('sequelize');
// const { Sequelize, DataTypes } = require('sequelize');

// const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory;';

// const sequelize = new Sequelize(DATABASE_URL);

module.exports = {
  // db: sequelize,
  users: userModel(db, DataTypes),
};
