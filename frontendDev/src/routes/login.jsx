import { useState,useEffect } from 'react'
import {Link ,Form,useNavigate,redirect} from 'react-router-dom'
import axios from 'axios'
import './login.css'
import {setToken,setRole,setWallet} from "../utils"

async function login_req(data){
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

export default function Login() {
  const navigate = useNavigate();
  const [input,setInput] = useState({});
  const [flag,setFlag] = useState(false);

  function handleChange({target}){
    var aux = input;
    input[target.name] = target.value;
    setInput(input);
  } 

  async function handleSubmit(){
    var resp = await login_req(input);

    if(resp != null){
      setFlag(true);
    }
  }

  useEffect(()=>{if(flag)navigate('/')});


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