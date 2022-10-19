import {Link ,Form} from 'react-router-dom'
import './login.css'

export default function Register({test}) {

  return (
    <>
    <p>
    <h1>Pagina de registo de utilizador {test}</h1>
    </p>

<div class = "box">
<div class = "loginbox">
  <div className='bemvindo'>
        <p>Bem Vindo</p>
  </div>

  <Form>
    <input type="text" id="nome" name="nome" placeholder='Nome Completo'/>


      <input type="email" id="email" name="Email" placeholder='Endereço Eletrónico'/>


    <div class="birthdate">
    <label for="date" >Data de nascimento:  </label>
    <input type="date" id="data" name="data" />
    </div>

    <input type="text" id="nif" name="nif" placeholder='NIF'/>
    <input type="text" id="cc" name="cc" placeholder='Número de identidade'/>
    <input type="text" id="morada" name="morada" placeholder='Morada, Número, Andar'/>
    <input type="text" id="telemovel" name="telemovel" placeholder='Telemóvel'/>
    <input type="password" id="password" name="password" placeholder='Palavra-passe'/>

  </Form>
  <div class = "button">
    <p>Confirmar</p>
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