import {Link ,Form,useNavigate} from 'react-router-dom'
import './login.css'

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

    //<button type="button" onClick={()=>{setToken({"token":"ola"})}}>create token</button>
    //<button type="button" onClick={()=>{sessionStorage.clear()}}>clear token</button>

export default function Login() {
  const navigation = useNavigate();
  return (
    <>

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
        <button class = "button" onClick={()=>{navigation('/');}}>
            Login
        </button>
        <p>Não tem conta?</p>
        <a href='register'>Registe-se já!</a>
      </div>

      <div class = "loginimg">
        <img src="loginimage.jpg" id="loginimage"/>
      </div>
      
      
    </div>
    
    </>
  );
}