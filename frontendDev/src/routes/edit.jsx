import {useLoaderData,useNavigate,Form} from 'react-router-dom';
import {useState} from "react";
import axios from "axios"
import Login from "./login"
import {getToken,getRole,getWallet,setWallet,parseDate} from "../utils"

export async function loader({params}){
	const token = params.perfilid;
	var ret;
	if(token == "undefined"){ret = null;}
	else ret = await axios({method:'GET',url:'http://localhost:8080/api/profileInfo/',params:{"ApostadorID":token}}) 
  		.then(function (response) {
    		console.log(response);
    		const data = response.data;
    		return data;
  		})
  		.catch(function (error) {
    		console.log(error);
    		return null;
  		}); 
	return ret;
}

async function edit(data){
	var res = await axios({method:'POST',url:'http://localhost:8080/api/editProfile/',data:data}) 
	  .then(function (response) {
	    console.log(response);
	    const data = response.data;
	    return response;
	  })
	  .catch(function (error) {
	    console.log(error);
	    return false;
	  });
}


export default function Perfil(props){
	const navigate = useNavigate();
	const perfil = useLoaderData();
	const [input,setInput] = useState({});

	console.log(perfil);

	setWallet(perfil.Balance);
	
	async function handleSubmit(){
		var data = input;
		data.ApostadorID = getToken();
		console.log(data);
		const ret = await edit(data);
	}

	function handleChange({target}){
		input[target.name] = target.value;
		setInput(input);
	}

	return(
	 <>
      <div className = "box">
        <div className = "loginbox">
          <div className='bemvindo'>
            <p>Perfil</p>
          </div>
          <Form onSubmit={handleSubmit}>
	          <p>Nome Completo:</p>
	          <input placeholder={perfil.Nome} onChange={handleChange} name="Nome"/>
	          <p>Morada:</p>
	          <input placeholder={perfil.Morada} onChange={handleChange} name="Morada"/>
	          <p>Telemovel:</p>
	          <input placeholder={perfil.Telemovel} onChange={handleChange} name="Telemovel"/>
          	<button className = "button" type="submit" style={{"margin-right":"30vh","margin-left":"30vh","width":"40%"}}>Save</button>
          </Form>
        </div>
      </div>
    </>
	);
}