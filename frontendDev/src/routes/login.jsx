import {Link ,Form} from 'react-router-dom'

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

export default function Login() {
  return (
    <>
    <p>
      <a href='/home'>Login</a>
    </p>
    <a href='/register'>Register</a>

    <button type="button" onClick={()=>{setToken({"token":"ola"})}}>create token</button>
    <button type="button" onClick={()=>{sessionStorage.clear()}}>clear token</button>

    
    </>
  );
}