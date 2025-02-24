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

const authenticateUser = async(username, password) => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM users 
      WHERE username='${username}';
    `);

    const user = rows[0];
    if(user) {
      const doesPasswordMatch = await bcrypt.compare(password, user.password);
      return 
    } else {
      throw new Error('Bad credentials');
    }
  } catch(err) {
    throw new Error(err);
  }
}

module.exports = {
  createUser,
  authenticateUser
}