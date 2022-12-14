import { useState,useEffect } from 'react'
import {Link ,Form,useNavigate,redirect} from 'react-router-dom'
import axios from 'axios'
import './login.css'
import {setToken,setRole,setRToken} from "../utils"
import {post_request} from "../requests"

    /**
     * Post request to login the user in RASBet
     * @param JSON Data whith the information for login the user
     * @returns Returns True if Post sucessed or error data
     */

async function login_req(data){
  var resp = await post_request('/login/',data)
  if (resp.error) resp = resp.data 
  else{
    console.log(resp)
    setToken(resp.data.Token)
    setRole(resp.data.FRole)
    setRToken(resp.data.RefreshToken)
    resp = true
  }

  return resp;
}

    /**
     * Component that render the Login page
     * @param JSON with filds set that is a function that set a flag if login successed and that same flag
     * @returns Returns HTML for the component 
     */

export default function Login({set,flag}) {
  const navigate = useNavigate();
  const [input,setInput] = useState({Email:"",PlvPasse:""});
  const [error,setError] = useState({});
  
  /**
   * Handle changes in the input fields 
   * @param input field that changed
   */

  function handleChange({target}){
    var aux = input;
    input[target.name] = target.value;
    setInput(input);
  } 

  /**
   * Handle submit of a form, send login request
   */

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
        <img alt="" src='logo.png' style={{'width':'50px','height':'50px','margin':'10px',"marginRight":"1px"}}/>
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
        <p>N??o tem conta?</p>
        <a href='register'>Registe-se j??!</a>
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
        <img alt="" src='logo.png' style={{'width':'50px','height':'50px','margin':'10px',"marginRight":"1px"}}/>
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
        <p>N??o tem conta?</p>
        <a href='register'>Registe-se j??!</a>
      </div>

      <div className = "loginimg" style={{"width":(width*0.7),"height":(width*0.5),"backgroundSize":"contain"}}>
      </div>
    </div>
    
    </>
  );
  }
}