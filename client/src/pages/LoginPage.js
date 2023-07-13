import { useState, useContext } from 'react';
import { Navigate} from 'react-router-dom'
import { UserContext } from '../UserContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  const { setUserInfo } = useContext(UserContext);

  async function login(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', //if have cookie its included in credentials
    })

    if (response.ok) {
      // const { jwt_token } = await response.json()
      // console.log(jwt_token)
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      })
    } else {
      alert('wrong credentials for login');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  
  return (
    <>
      <form className="login" onSubmit={login}>
        <input type="text"
          placeholder="username"
          value={username}
          onChange={((e) => { setUsername(e.target.value) })} />
        <input type="password" placeholder="password"
          value={password}
          onChange={((e) => { setPassword(e.target.value) })}/>
      <button>Login</button>
      </form>
    </>
  )
}

export default LoginPage;
