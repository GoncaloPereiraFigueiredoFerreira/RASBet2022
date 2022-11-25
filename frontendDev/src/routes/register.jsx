import {Link ,Form,redirect} from 'react-router-dom'
import axios from 'axios'
import './login.css'

import {setToken,setRole,setWallet,getDate_min} from "../utils"


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
    setWallet(0);
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
    <div className="logo">
      <img src='logo.png' style={{'width':'fit-content','height':'6vh','margin':'1vh'}}/>
      <p style={{'display':'inline','width':'fit-content',"color":"gold"}}> RASBet</p>        
    </div>

      <div className = "box">
        <div className = "loginbox">
          <div className='bemvindo'>
            <p>Registo</p>
          </div>

          <Form method="post">
            <input type="text" id="nome" name="Nome" placeholder='Nome Completo'/>


              <input type="email" id="email" name="Email" placeholder='Endereço Eletrónico'/>


            <div className="birthdate">
            <label htmlFor="date" >Data de nascimento:  </label>
            <input type="date" id="data" max={getDate_min()} name="DataNascimento" />
            </div>

            <input type="text" id="nif" name="NIF" pattern="\d{9}" placeholder='NIF'/>
            <input type="text" id="cc" name="CC" pattern="\d{8}" placeholder='Número de identidade'/>
            <input type="text" id="morada" name="Morada" placeholder='Morada, Número, Andar'/>
            <input type="text" id="telemovel" name="Telemovel" placeholder='Telemóvel'/>
            <input type="password" id="password" name="PlvPasse" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$" placeholder='Palavra-passe'/>

            <button className = "button" type="submit">Confirmar</button>
          </Form>
        </div>
        <div className = "loginimg">
          <img src="logoimage.png" id="loginimage"/>
        </div>
      </div>
    </>
  );
}