import {useLoaderData,useNavigate,Form} from 'react-router-dom';
import axios from "axios"
import Login from "./login"
import {getToken,getRole,getWallet,parseDate} from "../utils"
import {get_request} from "../requests"

    /**
     * Fetch the perfil information of the user
     * @param JSON whith filed perfilid that is the token of the user
     * @returns Returns the data if fetch sucessed or null
     */

export async function loader({params}){
	const token = params.perfilid;
	var ret;
	if(token == "undefined"){ret = null;}
	else ret = await get_request('/profileInfo/',{"ApostadorID":token})
	if(ret.error) ret = null
	else ret = ret.data
	return ret;
}

    /**
     * Component that render the Perfil page
     * @returns Returns HTML for the component 
     */

export default function Perfil(){
	const navigate = useNavigate();
	const perfil = useLoaderData();

	const width = window.innerWidth;


		return(
		<>
		<div className = "box" style={{'margin':(width>1000)?'25%':'5%','marginTop':'20px','paddingTop':'30px'}}>
			<div className = "loginbox">
			<div className='bemvindo'>
				<p>Perfil</p>
			</div>
			<p>Nome Completo:{perfil.Nome}</p>
			<p>Email:{perfil.Email}</p>
			<p>Data de nascimeto:{parseDate(perfil.DataNascimento)} </p>
			<p>Nif:{perfil.NIF}</p>
			<p>CC:{perfil.CC}</p>
			<p>Morada:{perfil.Morada}</p>
			<p>Telemovel:{perfil.Telemovel}</p>


			<button className = "button" type="submit" style={{'display': 'flex','justifyContent': 'center','alignItems': 'center'}} onClick={()=>(navigate(`/edit/${getToken()}`))}>Edit</button>
			</div>
		</div>
		</>
		);
	

}

