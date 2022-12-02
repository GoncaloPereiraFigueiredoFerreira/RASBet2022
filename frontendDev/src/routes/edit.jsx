import {useLoaderData,useNavigate,Form} from 'react-router-dom';
import {useState,useEffect} from "react";
import axios from "axios"
import Login from "./login"
import {getToken,getRole,getWallet,parseDate} from "../utils"


		/**
     * Fetch the profile information for the edit page
     * @param JSON whith filed perfilid that is the token of the user
     * @returns Returns the data if fetch sucessed or null
     */
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

		/**
     * Post request to edit the profile information of the user
     * @param JSON data to send in the Post request
     * @returns Returns the data if request sucessed or false
     */

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
	  return res;
}

		/**
     * Component that render the edit page
     * @returns Returns the HTML of the component
     */

export default function Perfil(props){
	const navigate = useNavigate();
	const perfil = useLoaderData();
	const [input,setInput] = useState({});
	const [flag,setFlag] = useState(false);

	console.log(perfil);
	
	async function handleSubmit(){
		var data = input;
		data.ApostadorID = getToken();
		console.log(data);
		const ret = await edit(data);
		if(ret) setFlag(true);
	}

  /**
   * Handle submit of a form, send edit request
   */

	function handleChange({target}){
		if(target.value != ""){
			input[target.name] = target.value;
		}
		else{
			delete input[target.name];
		}
		setInput(input);
	}

	useEffect(()=>{if(flag)navigate(-1)});

	const width = window.innerWidth;

	if(width>1000){
		return(
		<>
		<div className = "box" style={{'margin':'25%','margin-top':'2vh','padding-top':'3vh'}}>
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
				<input placeholder={perfil.Telemovel} onChange={handleChange} name="Telemovel" pattern="\d{9}" title="São necessário 9 números"/>
				<button className = "button" type="submit" style={{'display': 'flex','justify-content': 'center','align-items': 'center'}}>Save</button>
			</Form>
			</div>
		</div>
		</>
		);
	}
	else{
		return(
			<>
			<div className = "box" style={{'margin':'5%','margin-top':'2vh','padding-top':'3vh'}}>
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
					<input placeholder={perfil.Telemovel} onChange={handleChange} name="Telemovel" pattern="\d{9}" title="São necessário 9 números"/>
					<button className = "button" type="submit" style={{'display': 'flex','justify-content': 'center','align-items': 'center'}}>Save</button>
				</Form>
				</div>
			</div>
			</>
		);
	}
}