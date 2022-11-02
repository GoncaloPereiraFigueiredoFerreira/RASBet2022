import {useLoaderData,useNavigate,Form} from 'react-router-dom';
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

export default function Perfil(props){
	const navigate = useNavigate();
	const perfil = useLoaderData();

	console.log(perfil);

	setWallet(perfil.Balance);

	//if(!perfil){return navigate("/login");}
	return(
	 <>
      <div className = "box">
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

          <button className = "button" type="submit" style={{"margin-right":"30vh","margin-left":"30vh","width":"40%"}} onClick={()=>(navigate(`/edit/${getToken()}`))}>Edit</button>
        </div>
      </div>
    </>
	);
}

