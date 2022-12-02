import { useState,useEffect } from 'react'
import {Link ,Form,useNavigate,redirect} from 'react-router-dom'
import axios from 'axios'
import './login.css'
import {setToken,setRole} from "../utils"

async function login_req(data){
  console.log(data);
  var resp = await axios({method:'POST',url:'http://localhost:8080/api/login/',data:data}) 
  .then(function (response) {
    console.log(response);
    const data = response.data;
    setToken(data.Token);
    setRole(data.FRole);
    return true;
  })
  .catch(function (error) {
    console.log(error.response.data);
    return error.response.data;
  });

  return resp;
}

export default function Login({set,flag}) {
  const navigate = useNavigate();
  const [input,setInput] = useState({Email:"",PlvPasse:""});
  const [error,setError] = useState({});
  

  function handleChange({target}){
    var aux = input;
    input[target.name] = target.value;
    setInput(input);
  } 

  async function handleSubmit(){
    var resp = await login_req(input);
    if(resp == true){
      set(true);
    }
    else{
      setError(resp);
    }
  }

  useEffect(()=>{if(flag){set(false);navigate('/')}});

  const width = window.innerWidth;

  if(width>1000){
  return (
    <>

    <div className="logo"> 
        <img src='logo.png' style={{'width':'50px','height':'50px','margin':'1vh',"marginRight":"0.1vh"}}/>
        <p style={{'display':'inline','width':'fit-content',"color":"gold","marginLeft":"0","marginBottom":"10px","marginTop":"25px"}}> RASBet</p>        
    </div>

    <div className="box" >

      <div className = "loginbox" style={{"width":"5%"}}>
        <div className='bemvindo'>
          <p>Bem Vindo</p>
        </div>
        <Form onSubmit={handleSubmit}>
          <input type="text" name="Email" placeholder="Email" onChange={handleChange}/>
          <input type="password" name="PlvPasse" placeholder="Palavra-passe" onChange={handleChange}/>
          <button className = "button" type="submit">Login</button> 
          {(error.error)?<p style={{"color":"red"}}>{error.error}</p>:null}
        </Form>
        <p>Não tem conta?</p>
        <a href='register'>Registe-se já!</a>
      </div>

      <div className = "loginimg" >
      </div>
      
      
    </div>
    
    </>
  );
  }
  else{

  return (
    <>

    <div className="logo" >
        <img src='logo.png' style={{'width':'50px','height':'50px','margin':'1vh',"marginRight":"0.1vh"}}/>
        <p style={{'display':'inline','width':'fit-content',"color":"gold","marginLeft":"0","marginBottom":"10px","marginTop":"25px"}}> RASBet</p>         
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
          {(error.error)?<p style={{"color":"red"}}>{error.error}</p>:null}
        </Form>
        <p>Não tem conta?</p>
        <a href='register'>Registe-se já!</a>
      </div>

      <div className = "loginimg" style={{"width":(width*0.7),"height":(width*0.5),"backgroundSize":"contain"}}>
      </div>
    </div>
    
    </>
  );
  }
}