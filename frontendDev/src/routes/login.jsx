import {Link ,Form} from 'react-router-dom'
import './login.css'

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

    <div class="logo">
    <img src="logo" id="logologin"/>
    </div>

    <div class="box">

      <div class = "loginbox">
        <div className='bemvindo'>
          <p>Bem Vindo</p>
        </div>
        <Form>
          <input type="text" name="Email" placeholder="Email"/>
          <input type="password" name="Email" placeholder="Palavra-passe"/>
        </Form>
        <div class = "button">
          <p>Login</p>
        </div>
        <p>Não tem conta?</p>
        <Link to='register'>Registe-se já!</Link>
      </div>

      <div class = "loginimg">
        <img src="loginimage.jpg" id="loginimage"/>
      </div>
      
      
    </div>
    
    </>
  );
}