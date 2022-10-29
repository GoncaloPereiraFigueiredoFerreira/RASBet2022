import {useLoaderData,useNavigate,Form} from 'react-router-dom';
import axios from "axios"
import Login from "./login"
import {getToken} from "../utils"

export async function loader({params}){
	const token = params.perfilid;
	var ret;
	if(token == "undefined"){ret = null;}
	else ret = await axios({method:'GET',url:'http://localhost:8080/api/profileInfo/',params:{"ApostadorID":token}}) 
  		.then(function (response) {
    		console.log(response);
    		const data = response.data[0];
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
	var money = 0;

	props.setWallet(perfil.Balance);

	function handleChange({target}){
		money = target.value;
	}

	function Levantar(){
	  var data={Valor:money,Tipo:"LC",ApostadorID:getToken(),DataTR:"2022-10-14 00:00:00"};
	  console.log(data);
	  var resp = axios({method:'POST',url:'http://localhost:8080/api/transaction/',data:data}) 
	  .then(function (response) {
	    console.log(response);
	    const data = response.data;
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
	}

	function Depositar(){
	  var data={Valor:money,Tipo:"Deposito_Conta",ApostadorID:getToken(),DataTR:"2022-10-14 00:00:00"};
	  console.log(data);
	  var resp = axios({method:'POST',url:'http://localhost:8080/api/transaction/',data:data}) 
	  .then(function (response) {
	    console.log(response);
	    const data = response.data;
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
	}


	//if(!perfil){return navigate("/login");}
	return(
	<>
		<h1>Email:{perfil.Email}</h1>
		<h1>Pass:{perfil.PlvPasse}</h1>
		<h1>Balance:{perfil.Balance}</h1>
		<Form onSubmit={Depositar}>
			<input placeholder="quantia" name="money" onChange={handleChange}/>
			<button type="submit">Depositar</button>
		</Form>
		<Form onSubmit={Levantar}>
			<input placeholder="quantia" name="money" onChange={handleChange}/>
			<button type="submit">Levantar</button>
		</Form>
	</>
	);
}

