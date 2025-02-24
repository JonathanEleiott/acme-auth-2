import { useState, useEffect } from 'react';

const App = () => {
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [errorMessage, setErrorMessage] = useState('');

  const [name, setName] = useState('');

  const attemptLogInWithToken = async() => {
    if(token) {
      const response = await fetch('/api/v1/login', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        }
      });

      const responseJsonObject = await response.json();
      setName(responseJsonObject.user.username);
    }
  }

  useEffect(() => {
    attemptLogInWithToken();
  }, [token]);

  const logIn = async(event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: inputUsername,
          password: inputPassword
        })
      });
      const tokenObj = await response.json();
      console.log(tokenObj);

      if(tokenObj.token) {
        localStorage.setItem('token', tokenObj.token);
        setToken(tokenObj.token);
      } else {
        setErrorMessage(tokenObj.message);
      }
    } catch(err) {
      console.log(err);
    }
  }

  const logOut = () => {
    localStorage.removeItem('token');
    setToken('');
  }

  return (
    <>
      <h1>ACME Auth</h1>

      <h2>{errorMessage}</h2>

      {
        token ?
          <>
            <h1>Welcome {name}</h1> 
            <button onClick={ logOut }>Log Out</button>
          </> :
          <form onSubmit={ logIn }>
            <input 
              placeholder="username"
              onChange={(event) => { setInputUsername(event.target.value) }}
            />

            <input 
              placeholder="password"
              onChange={(event) => { setInputPassword(event.target.value) }}
            />

            <button>Log In</button>
          </form>
      }
      
    </>
  )
}

export default App
