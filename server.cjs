const client = require('./db/client.cjs');
client.connect();
const { authenticateUser, logInWithToken } = require('./db/users.cjs');

const express = require('express');
const app = express();

app.use(express.json());

app.use(express.static('dist'));

// app.get('/', (req, res, next) => {
//   res.send('WELCOME!');
// });

app.post('/api/v1/login', async(req, res, next) => {
  const { username, password } = req.body;
  try {
    const token = await authenticateUser(username, password);
    res.send({ token: token });
  } catch(err) {
    res.send({ message: 'Bad Credentials' });
  }
});

app.get('/api/v1/login', async(req, res, next) => {
  try {
    const user = await logInWithToken(req.headers.authorization);
    res.send({ user })
  } catch(err) {
    res.send({ message: err.message });
  }
})

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});