import { useState,useEffect } from 'react'
import {Link ,Form,useNavigate,redirect} from 'react-router-dom'
import axios from 'axios'
import './login.css'

import {setToken,setRole,getDate_min} from "../utils"
import {post_request} from "../requests"

    /**
     * Post request to register a new user
     * @param JSON data to send in the Post request
     * @returns Returns true if request sucessed or an error
     */


async function register_req(data){
  var resp = await post_request('/register/',data)
  if (resp.error) resp = resp.data
  else {
    setToken(resp.data.Token)
    setRole("apostador")
    setRToken(resp.data.RefreshToken)
    resp = true
  }

  return resp;
}

    /**
     * Component that render the Register page
     * @returns Returns HTML for the component 
     */

export default function Register({set,flag}) {
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
   * Handle submit in a form, send register request
   */

  async function handleSubmit(){
    let resp = await register_req(input);

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
      <div className="logo" onClick={()=>{navigate('/login');}} >
        <img alt="" src='logo.png' style={{'width':'50px','height':'50px','margin':'10px',"marginRight":"1px"}}/>
        <p style={{'display':'inline','width':'fit-content',"color":"gold","marginLeft":"0","marginBottom":"10px","marginTop":"25px"}}> RASBet</p>        
      </div>
      <div className = "box">
        <div className = "loginbox" style={{"width":"5%"}}>
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
            {(error.error)?<p style={{"color":"red"}}>{error.error}</p>:null}
          </Form>
        </div>
        <div className = "loginimg">
        </div>
      </div>
    </>
  );
}
else{
  return (
    <>
      <div className="logo" onClick={()=>{navigate('/login');}}>
        <img alt="" src='logo.png' style={{'width':'50px','height':'50px','margin':'10px',"marginRight":"1px"}}/>
        <p style={{'display':'inline','width':'fit-content',"color":"gold","marginLeft":"0","marginBottom":"10px","marginTop":"25px"}}> RASBet</p>         
      </div>
      <div className = "box">
        <div className = "loginbox" style={{"width":"100%"}}>
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
            {(error.error)?<p style={{"color":"red"}}>{error.error}</p>:null}
          </Form>
        </div>
        <div className = "loginimg" style={{"width":(width*0.7),"height":(width*0.5),"backgroundSize":"contain"}}>
        </div>
      </div>
    </>
  );
}
}