const client = require('./client.cjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if(isPasswordMatch) {
        const token = await jwt.sign({ username: user.username }, process.env.JWT_SECRET);
        return token;
      } else {
        throw new Error('Bad credentials');
      }
    } else {
      throw new Error('Bad credentials');
    }
  } catch(err) {
    throw new Error('Bad Credentials');
  }
}

const logInWithToken = async(token) => {
  try {
    const usefulInfo = await jwt.verify(token, process.env.JWT_SECRET);

    const { rows } = await client.query(`
      SELECT * FROM users WHERE username='${usefulInfo.username}'
    `);

    const user = rows[0];

    if(user) {
      return { username: user.username };
    } else {
      return { message: 'Bad Token' }
    }
  } catch(err) {
    throw err;
  }
}

module.exports = {
  createUser,
  authenticateUser,
  logInWithToken
}