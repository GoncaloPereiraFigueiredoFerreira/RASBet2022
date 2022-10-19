import {Link ,Form,redirect} from 'react-router-dom'
import './login.css'

export async function action({request,params}){
  const data = await request.formData();
  console.log(data);
  return redirect("/");
}

export default function Register() {

  return (
    <>
      <h1>Pagina de registo de utilizador</h1>

      <div className = "box">
        <div className = "loginbox">
          <div className='bemvindo'>
            <p>Bem Vindo</p>
          </div>

          <Form method="post">
            <input type="text" id="nome" name="nome" placeholder='Nome Completo'/>


              <input type="email" id="email" name="Email" placeholder='Endereço Eletrónico'/>


            <div className="birthdate">
            <label htmlFor="date" >Data de nascimento:  </label>
            <input type="date" id="data" name="data" />
            </div>

            <input type="text" id="nif" name="nif" placeholder='NIF'/>
            <input type="text" id="cc" name="cc" placeholder='Número de identidade'/>
            <input type="text" id="morada" name="morada" placeholder='Morada, Número, Andar'/>
            <input type="text" id="telemovel" name="telemovel" placeholder='Telemóvel'/>
            <input type="password" id="password" name="password" placeholder='Palavra-passe'/>

            <button className = "button" type="submit">Confirmar</button>
          </Form>
        </div>
        <div className = "loginimg">
          <img src="loginimage.jpg" id="loginimage"/>
        </div>
      </div>
    </>
  );
}