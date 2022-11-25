import { useState,useEffect } from 'react'
import {Link ,Form,useNavigate,redirect} from 'react-router-dom'
import axios from 'axios'
import './login.css'

import {setToken,setRole,setWallet,getDate_min} from "../utils"


export async function action(data){
 
  console.log(data);
  var resp = await axios({method:'POST',url:'http://localhost:8080/api/register/',data:data}) 
  .then(function (response) {
    console.log(response);
    const data = response.data;
    setToken(data.Token);
    setRole("apostador");
    setWallet(0);
    return true;
  })
  .catch(function (error) {
    console.log(error.response.data);
    return error.response.data;
  });
  
  return resp;
}

export default function Register({set,flag}) {
  const navigate = useNavigate();
  const [input,setInput] = useState({Email:"",PlvPasse:""});
  const [error,setError] = useState({});
  

  function handleChange({target}){
    var aux = input;
    input[target.name] = target.value;
    setInput(input);
  } 

  async function handleSubmit(){
    var resp = await action(input);
    setError(resp);
    if(resp == true){
      set(true);
    }
  }

  useEffect(()=>{if(flag){set(false);navigate('/sport/FUTPT')}});
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

          <Form onSubmit={handleSubmit}>
            <input type="text" id="nome" name="Nome" placeholder='Nome Completo' onChange={handleChange}/>


            <input type="email" id="email" name="Email" placeholder='Endereço Eletrónico' onChange={handleChange}/>


            <div className="birthdate">
            <label htmlFor="date" >Data de nascimento:  </label>
            <input type="date" id="data" max={getDate_min()} name="DataNascimento" onChange={handleChange}/>
            </div>

            <input type="text" id="nif" name="NIF" pattern="\d{9}" title="São necessário 9 números" placeholder='NIF' onChange={handleChange}/>
            <input type="text" id="cc" name="CC" pattern="\d{8}" title="São necessário 8 números" placeholder='Número de identidade' onChange={handleChange}/>
            <input type="text" id="morada" name="Morada" placeholder='Morada, Número, Andar'onChange={handleChange}/>
            <input type="text" id="telemovel" name="Telemovel" pattern="\d{9}" title="São necessário 9 números" placeholder='Telemóvel'onChange={handleChange}/>
            <input type="password" id="password" name="PlvPasse" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$" title="É necessário uma letra minúscula e maiúscula, um carácter especial um número e tamanho mínimo de 8 carácteres" placeholder='Palavra-passe'onChange={handleChange}/>

            <button className = "button" type="submit">Confirmar</button>
            {(error.error)?<p>{error.error}</p>:null}
          </Form>
        </div>
        <div className = "loginimg">
          <img src="logoimage.png" id="loginimage"/>
        </div>
      </div>
    </>
  );
}