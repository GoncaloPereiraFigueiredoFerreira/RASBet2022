import {useLoaderData,useNavigate,Form} from 'react-router-dom';
import {useState,useEffect} from "react";
import axios from "axios"
import Login from "./login"
import {getToken,getRole,getWallet,parseDate} from "../utils"
import {post_request,get_request} from "../requests"


		/**
     * Fetch the profile information for the edit page
     * @param JSON whith filed perfilid that is the token of the user
     * @returns Returns the data if fetch sucessed or null
     */
export async function loader({params}){
	const token = params.perfilid;
	let ret;
	if(token == "undefined"){ret = null;}
	else ret = await get_request("/profileInfo/",{"ApostadorID":token})
	if (ret.error) ret = null
	else ret = ret.data

	console.log(ret)
	return ret;
}

		/**
     * Post request to edit the profile information of the user
     * @param JSON data to send in the Post request
     * @returns Returns the data if request sucessed or false
     */

async function edit(data){
	let ret = await post_request('/editProfile/',data) 
	if(ret.error) ret = false
	else ret = ret.data
	return ret;
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

	
	async function handleSubmit(){
		var data = input;
		data.ApostadorID = getToken();
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
		return(
		<>
		<div className = "box" style={{'margin':(width>1000)?'25%':'5%','marginTop':'2vh','paddingTop':'3vh'}}>
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
					<button className = "button" type="submit" 
							style={{'display': 'flex','justifyContent': 'center','alignItems': 'center',"marginTop":"10px"}}>Save</button>
				</Form>
			</div>
		</div>
		</>
		);
	
}