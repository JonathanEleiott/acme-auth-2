const client = require('./client.cjs');
const bcrypt = require('bcrypt');

const createUser = async(usernameToCreate, passwordToCreate) => {
  try {
    const encryptedPassword = await bcrypt.hash(passwordToCreate, 10);

    await client.query(`
      INSERT INTO users (username, password)
      VALUES ($1, $2);
    `, [usernameToCreate, encryptedPassword]);
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  createUser
}