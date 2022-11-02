import {Link ,Form,redirect} from 'react-router-dom'
import axios from 'axios'
import './login.css'

import {setToken,setRole,setWallet} from "../utils"


export async function action({request,params}){
  const data = await request.formData();
  const updates = Object.fromEntries(data);
  console.log(updates);
  var flag = await axios({method:'POST',url:'http://localhost:8080/api/register/',data:updates}) 
  .then(function (response) {
    console.log(response);
    const data = response.data;
    setToken(data.Token);
    setRole("apostador");
    if(data.FRole == "apostador") setWallet(data.Balance);
    return response;
  })
  .catch(function (error) {
    console.log(error,flag);
    return false;
  });
  

  console.log(flag);
  if(flag){
    return redirect("/");
  }
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
            <input type="text" id="nome" name="Nome" placeholder='Nome Completo'/>


              <input type="email" id="email" name="Email" placeholder='Endereço Eletrónico'/>


            <div className="birthdate">
            <label htmlFor="date" >Data de nascimento:  </label>
            <input type="date" id="data" name="DataNascimento" />
            </div>

            <input type="text" id="nif" name="NIF" placeholder='NIF'/>
            <input type="text" id="cc" name="CC" placeholder='Número de identidade'/>
            <input type="text" id="morada" name="Morada" placeholder='Morada, Número, Andar'/>
            <input type="text" id="telemovel" name="Telemovel" placeholder='Telemóvel'/>
            <input type="password" id="password" name="PlvPasse" placeholder='Palavra-passe'/>

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