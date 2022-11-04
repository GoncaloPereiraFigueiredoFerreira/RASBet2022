import { useState,useEffect } from 'react'
import {Link ,Form,useNavigate,redirect} from 'react-router-dom'
import axios from 'axios'
import './login.css'
import {setToken,setRole,setWallet} from "../utils"

async function login_req(data){
  console.log(data);
  var resp = axios({method:'POST',url:'http://localhost:8080/api/login/',data:data}) 
  .then(function (response) {
    console.log(response);
    const data = response.data;
    setToken(data.Token);
    setRole(data.FRole);
    if(data.FRole == "apostador") setWallet(data.Balance);
    return true;
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });

  return resp;
}

export default function Login({set,flag}) {
  const navigate = useNavigate();
  const [input,setInput] = useState({});
  

  function handleChange({target}){
    var aux = input;
    input[target.name] = target.value;
    setInput(input);
  } 

  async function handleSubmit(){
    var resp = await login_req(input);

    if(resp != null){
      set(true);
    }
  }

  useEffect(()=>{if(flag){set(false);navigate('/')}});


  return (
    <>

    <div className="logo">
    <img src="logo" id="logologin"/>
    </div>

    <div className="box">

      <div className = "loginbox">
        <div className='bemvindo'>
          <p>Bem Vindo</p>
        </div>
        <Form onSubmit={handleSubmit}>
          <input type="text" name="Email" placeholder="Email" onChange={handleChange}/>
          <input type="password" name="PlvPasse" placeholder="Palavra-passe" onChange={handleChange}/>
          <button className = "button" type="submit">Login</button> 
        </Form>
        <p>Não tem conta?</p>
        <a href='register'>Registe-se já!</a>
      </div>

      <div className = "loginimg">
        <img src="loginimage.jpg" id="loginimage"/>
      </div>
      
      
    </div>
    
    </>
  );
}