import {useLoaderData,useNavigate,Form} from 'react-router-dom';
import axios from "axios"
import Login from "./login"
import {getToken,getRole,getWallet,parseDate} from "../utils"

    /**
     * Fetch the perfil information of the user
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
     * Component that render the Perfil page
     * @returns Returns HTML for the component 
     */

export default function Perfil(){
	const navigate = useNavigate();
	const perfil = useLoaderData();

	console.log(perfil);
	const width = window.innerWidth;

	if(width>1000){
		return(
		<>
		<div className = "box" style={{'margin':'25%','marginTop':'20px','paddingTop':'30px'}}>
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
	else{
		return(
		<>
		<div className = "box" style={{'margin':'5%','marginTop':'20px','paddingTop':'30px'}}>
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
}

