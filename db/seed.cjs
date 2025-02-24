const client = require('./client.cjs');
const { createUser } = require('./users.cjs');

const dropTables = async() => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS users;
    `);
  } catch(err) {
    console.log(err);
  }
}

const createTables = async() => {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) NOT NULL UNIQUE,
        password VARCHAR(60) NOT NULL
      );
    `);
  } catch(err) {
    console.log(err);
  }
}

const syncAndSeed = async() => {
  await client.connect();
  console.log('CONNECTED TO THE DB');

  console.log('DROPPING TABLES');
  await dropTables();
  console.log('TABLES DROPPED');

  console.log('CREATING TABLES');
  await createTables();
  console.log('TABLES CREATED');

  console.log('CREATING USERS');
  await createUser('larry', 'larry1');
  await createUser('curly', 'curly1');
  await createUser('moe', 'moe1');
  await createUser('lucy', 'lucy1');
  console.log('USERS CREATED');

  await client.end();
  console.log('DISCONNECTED FROM THE DB');
}

syncAndSeed();