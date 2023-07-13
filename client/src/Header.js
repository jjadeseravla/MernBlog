import { Link } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { UserContext } from './UserContext';

export default function Header() {

  const { setUserInfo, userInfo } = useContext(UserContext);

  // const [username, setUsername] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(jsonUserInfo => {
        // console.log(jsonUserInfo, 'why is this empty?!')
        // setUsername(jsonUserInfo.username);
        setUserInfo(jsonUserInfo);
      })
    })
  }, []);

  const logout = () => { //invalidate cookie
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    })
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">Jade Blog</Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a href='https://www.collinsdictionary.com/dictionary/spanish-english/avasallar' onClick={logout}>Logout</a>
          </>
        )}
        {!username && (  
          <>
           <Link to="/login" className="logo">Login</Link>
           <Link to="/register" className="logo">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}