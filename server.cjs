const client = require('./db/client.cjs');
client.connect();
const { authenticateUser } = require('./db/users.cjs');

const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res, next) => {
  res.send('WELCOME!');
});

app.post('/api/v1/login', async(req, res, next) => {
  const { username, password } = req.body;
  try {
    const x = await authenticateUser(username, password);
  } catch(err) {
    next(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});