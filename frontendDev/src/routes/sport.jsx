import {useState} from 'react'
import {useLoaderData,Form} from 'react-router-dom';
import axios from "axios"	

import {getToken,getRole,getDate} from "../utils"

import Bet from "../templates/Bet"
import Bet_spec from "../templates/Bet_spec"
import Bet_admin from "../templates/Bet_admin"

async function reg_bet(data){
  var resp = axios({method:'POST',url:'http://localhost:8080/api/registerBet/',data:data}) 
  .then(function (response) {
    console.log("response",response);
    const data = response.data;
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });

  return resp;
}

async function add_cod(data){
  var resp = axios({method:'POST',url:'http://localhost:8080/api/addPromocao/',data:data}) 
  .then(function (response) {
    console.log("response",response);
    const data = response.data;
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });

  return resp;
}

async function rm_cod(data){
  var resp = axios({method:'POST',url:'http://localhost:8080/api/remPromocao/',data:data}) 
  .then(function (response) {
    console.log("response",response);
    const data = response.data;
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });

  return resp;
}

async function used_cod(data){
  var resp = axios({method:'GET',url:'http://localhost:8080/api/usedCod/',params:data}) 
  .then(function (response) {
    console.log("response",response);
    const data = response.data;
    return data;
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });

  return resp;
}

export async function loader({params}){
	const token = getToken();
	var ret = await axios({method:'GET',url:'http://localhost:8080/api/eventList/',params:{"token":token,"sport":params.sportid}}) 
	  .then(function (response) {
	    console.log(response);
	    const data = {sportid:(params.sportid)?params.sportid:"FUT",sport:response.data};
	    return data;
	  })
	  .catch(function (error) {
	    console.log(error);
	    return null;
	  });
	  if(getRole() == "Admin"){ret.cods =  await getCods()}
	return ret;
}

async function getCods(){
	const ret = await axios({method:'GET',url:'http://localhost:8080/api/getpromocoes/',params:{"Token":getToken()}}) 
	  .then(function (response) {
	    console.log("codigos",response.data);
	    const data = response.data;
	    return data;
	  })
	  .catch(function (error) {
	    console.log(error);
	    return null;
	  });
	return ret;
}


export default function Sport(props){
	const {sportid,sport,cods} = useLoaderData();
	const [apostas,setApostas] = useState({simples:null,mult:[]});
	const [state,setState] = useState(true);
	const [input,setInput] = useState({});

	const role = getRole();

	if(role == "apostador"){

		function handleChange({target}){
		    input[target.name] = parseInt(target.value);
		} 
		function handleChangeCodS({target}){
			input[target.name] = target.value;
			input.check = false;
			setInput(input);
		}

		async function handleSubmit(){
			if(state){
				var ret = null;
				var data = apostas.simples;
				data.Aposta.DateAp = getDate();
				data.Eventos = [data.Evento];
				delete data.Desc;
				delete data.Evento;
				data.Aposta.Montante = input.valor;
				data.Codigo = (input.check) ? input.codigo:null;
				console.log("registo simles",data)
				ret = await reg_bet(data);
			}
			else{
				var ret = null;
				var data = {};
				data.Aposta = apostas.mult[0].Aposta;
				data.Aposta.Montante = input.valor;
				data.Aposta.DateAp = getDate();
				data.Eventos = apostas.mult.map((e)=>(e.Evento));
				data.Codigo = (data.Codigo != "")? data.Codigo:null
				console.log("registo mult",data);
				ret = await reg_bet(data);
				console.log(ret);
			}

			console.log(ret);
		}

		async function handleSubmit_cod(){
			var ret = null;
			var data = {ApostadorID:getToken(),Codigo:input.codigo};
			ret = await used_cod(data);
			console.log("ret cod", ret);
			if(ret.Res == "Nao"){input.check=true;}
		}

		function addBet(aposta){
			var napostas = {...apostas};
			if(state){
				napostas.simples = aposta;
				napostas.simples.Evento.Desporto = sportid;
				setApostas(napostas);
			}
			else{
				aposta.Evento.Desporto = sportid;
				if(!apostas.mult.map((e)=>(e.Evento.EventoID + e.Evento.Escolha)).includes(aposta.Evento.EventoID.toString()+aposta.Evento.Escolha.toString()))
					napostas.mult.push(aposta);
				setApostas(napostas);
			}
			console.log(aposta);
		}

		function rmBet(aposta){
			var napostas = {...apostas};
			napostas.simples = (apostas.simples && apostas.simples.Evento.EventoID == aposta.Evento.EventoID && apostas.simples.Evento.Escolha == aposta.Evento.Escolha)?null:aposta;
			napostas.mult = apostas.mult.filter((e)=>{console.log(e.Evento.EventoID != aposta.Evento.EventoID && e.Evento.Escolha != aposta.Evento.Escolha);if(e.Evento.EventoID != aposta.Evento.EventoID && e.Evento.Escolha != aposta.Evento.Escolha) return aposta});
			setApostas(napostas);			
		}

		return(
			<>
				<div className="sidebar" id="Leftbar">
					<p style={{"padding":"5px"}}>Competiçoes</p>
				</div>
				<div className="betpage">
					<Bet data={sport} addBet={addBet}/>
				</div>
				
				<div className="betzone" id="Rightbar">

					<div className="betbox" id="Simples">
						<div>
							<button style={state?{"width":"45%","margin":"3px","backgroundColor":"red"}:{"width":"45%","margin":"3px"}} onClick={()=>(setState(true))}>Simples</button>
							<button style={state?{"width":"45%","margin":"3px"}:{"width":"45%","margin":"3px","backgroundColor":"red"}} onClick={()=>(setState(false))}>Multiplas</button>
						</div>
						  	{state?(<>	
						  		{apostas.simples?(
							  		<div className="bet">
										<p>{apostas.simples.Desc.Evento}</p>
										<p>Bet: {apostas.simples.Desc.Aposta}</p>
										<p>Odd: {apostas.simples.Aposta.Odd}</p>
										<button style={{"margin":"3px"}} onClick={()=>(rmBet(apostas.simples))}>Cancelar</button>				              	
							  		</div>):null
						  		}
							</>):(<>

					  	{apostas.mult.map((evento)=>(
							<div className="bet" key={"a_"+evento.Evento.EventoID+evento.Evento.Escolha}>
								<p>{evento.Desc.Evento}</p>
								<p>Bet: {evento.Desc.Aposta}</p>
								<p>Odd: {evento.Aposta.Odd}</p>
								<button style={{"margin":"3px"}} onClick={()=>(rmBet(evento))}>Cancelar</button>
							</div>
					  	))}</>)}
						<Form onSubmit={handleSubmit_cod}>
							<input type="value" placeholder='Codigo' name="codigo" onChange={handleChangeCodS}/>
							<button style={{"margin":"3px"}} type="subit">Aplicar</button>
						</Form>
						<Form onSubmit={handleSubmit}>
							<input type="value" placeholder='Aposta' name="valor" onChange={handleChange}/>
							<button style={{"margin":"3px"}} type="subit">Submeter</button>
						</Form>
					</div>
				</div>
			</>
				);
	}

	if(role == "Special")
		return(<>  
		<div className="sidebar" id="Leftbar">
            <p style={{"padding":"5px"}}>Competiçoes</p>
        </div>
		<div className="betpage-spec">
			<Bet_spec data={sport} tipo={sportid}/>
		</div></>
				);

	if(role == "Admin"){

		function handleChange({target}){
			input[target.name] = target.value;
			setInput(input);
		}

		function handleSubmit(){
			var data = {Token:getToken(),Promocao:input};
			console.log("add code",data);
			add_cod(data);
		}

		return(
			<>
	        <div className="sidebar" id="Leftbar">
    	        <p style={{"padding":"5px"}}>Competiçoes</p>
        	</div>
				<div className="betpage">
					<Bet_admin data={sport} sport={sportid}/>
				</div>
				
				<div className="betzone" id="Rightbar">

		            <div className="betbox" id="Multiplas">
		              {cods.map((cod)=>(
			              <div className="bet" key={cod}>
			                <p>Codigo:{cod.Codigo}</p>
			                <p>Valor:{cod.Valor}</p>
			                <button style={{"margin":"3px"}} onClick={()=>rm_cod({Token:getToken(),Codigo:cod.Codigo})}>Cancelar</button>
			              </div>
		              ))}
		              <Form onSubmit={handleSubmit}>
		              	<input type="value" placeholder='Codigo' name="Codigo" onChange={handleChange}/>
		              	<input type="value" placeholder='valor' name="Valor" onChange={handleChange}/>
		              	<button style={{"margin":"3px"}} type="subit">Submeter</button>
		              </Form>
		            </div>
		        </div>
            </>
		);
	}
}