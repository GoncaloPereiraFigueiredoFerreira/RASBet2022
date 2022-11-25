import {useState} from 'react'
import {useLoaderData,Form} from 'react-router-dom';
import axios from "axios"	

import {getToken,getRole,getDate,setWallet,getWallet} from "../utils"

import Bet from "../templates/Bet"
import Bet_spec from "../templates/Bet_spec"
import Bet_admin from "../templates/Bet_admin"



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
	    const data = {sportid:(params.sportid)?params.sportid:"FUT",sport:response.data.EventList,ligas:response.data.Leagues};
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


export default function Sport({set}){
	const {sportid,sport,cods,ligas} = useLoaderData();
	const [apostas,setApostas] = useState({simples:null,mult:[]});
	const [state,setState] = useState(true);
	const [input,setInput] = useState({});

	const role = getRole();

	if(role == "apostador"){

		async function reg_bet(data){
		  var resp = axios({method:'POST',url:'http://localhost:8080/api/registerBet/',data:data}) 
		  .then(function (response) {
		    console.log("response",response);
		    const data = response.data;
		    setWallet(data.Balance);
		    set({Valor:data.Balance});
		  })
		  .catch(function (error) {
		    console.log(error);
		    return null;
		  });

		  return resp;
		}

		function handleChange({target}){
		    input[target.name] = parseInt(target.value);
		} 
		function handleChangeCodS({target}){
			input[target.name] = target.value;
			input.check = false;
			setInput(input);
		}

		function handleSubmit(){
			if(window.confirm("Deseja apostar?")){
				if(state){
					var ret = null;
					var data = apostas.simples;
					data.Aposta.DateAp = getDate();
					data.Eventos = [data.Evento];
					delete data.Desc;
					delete data.Evento;
					data.Aposta.Montante = input.valor;
					data.Aposta.Codigo = (input.check) ? input.codigo:null;
					console.log("registo simles",data)
					ret = reg_bet(data);
					var napostas = {...apostas};
					napostas.simples = null;
					setApostas(napostas);
				}
				else{
					var ret = null;
					var data = {};
					data.Aposta = apostas.mult[0].Aposta;
					data.Aposta.Montante = input.valor;
					data.Aposta.DateAp = getDate();
					data.Aposta.Odd = apostas.mult.map((e)=>(e.Aposta.Odd)).reduce((x,y)=>(x*y),1);
					data.Eventos = apostas.mult.map((e)=>(e.Evento));
					data.Aposta.Codigo = (input.check) ? input.codigo:null;
					console.log("registo mult",data);
					ret = reg_bet(data);
					console.log(ret);
					var napostas = {...apostas};
					napostas.mult = [];
					setApostas(napostas);
				}

				console.log(ret);
			}
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
					<input type="text" name="searchbar" placeholder="Procure por um jogo"
					style={{"margin-left":"1vh","border-radius":"10px","margin":"1vh",'width':'95%'}}/>
					
					<p style={{"margin-left":"1vh","border-radius":"10px","margin":"1vh"}}>
						Competições</p>
					<div className="competitions">
						{ligas.map((i,ind)=>(<button className='comp-button' style={{"border":"0px"}} key={ind}>{i}</button>))}
					</div>
				</div>
				<div className="betpage">
					<Bet data={sport} addBet={addBet}/>
				</div>
				
				<div className="betzone" id="Rightbar">

					<div className="betbox" id="Simples">
						<div>
							<button className='bet-type-button' style={state?{'font-weight':'bold','border-bottom':'2px solid gray'}:{'border-bottom':'1px solid lightgray'}} onClick={()=>(setState(true))}>Simples</button>
							<button className='bet-type-button' style={state?{'float':'right','border-bottom':'1px solid lightgray'}:{'font-weight':'bold','float':'right','border-bottom':'2px solid gray'}} onClick={()=>(setState(false))}>Multiplas</button>
						</div>
						  	{state?(<>	
						  		{apostas.simples?(
							  		<div className="bet">
										<p style={{"margin":"0","margin-right":"1vh",'float':'right','font-weight':'bold'}} onClick={()=>(rmBet(apostas.simples))}>x</p>
										<p style={{"margin":"1vh",'padding-left':'1vh','font-weight':'bold','color':'gray'}}>
											{apostas.simples.Desc.Evento}</p>
										<p style={{"margin":"1vh",'padding-left':'1vh','font-weight':'bold','color':'black'}}>
											Resultado: {apostas.simples.Desc.Aposta} {apostas.simples.Aposta.Odd}</p>	              	
							  		</div>):null
						  		}
							</>):(<>

					  	{apostas.mult.map((evento)=>(
							<div className="bet" key={"a_"+evento.Evento.EventoID+evento.Evento.Escolha}>
								<p style={{"margin":"0","margin-right":"1vh",'float':'right','font-weight':'bold'}} onClick={()=>(rmBet(evento))}>x</p>
								<p style={{"margin":"1vh",'padding-left':'1vh','font-weight':'bold','color':'gray'}}>
									{evento.Desc.Evento}</p>
								<p style={{"margin":"1vh",'padding-left':'1vh','font-weight':'bold','color':'black'}}>
									Resultado: {evento.Desc.Aposta} {evento.Aposta.Odd}</p>	 
							</div>
					  	))}</>)}
						<Form onSubmit={handleSubmit_cod} style={{'margin':'1vh'}}>
							{(input.check)?<img src="check.png"/>:null}
							<input type="value" placeholder='Codigo' name="codigo" onChange={handleChangeCodS} style={{'width':'60%'}}/>
							<button style={{'margin-left':'5%','width':'30%','background-color':'red','color':'white'}} type="subit">Aplicar</button>
						</Form>
						<Form onSubmit={handleSubmit}>
							<input type="number" placeholder='Aposta' name="valor" pattern="\d*(\.\d{1,2}|)" max={getWallet()} title="Intruduza montante válido" onChange={handleChange} style={{'width':'60%'}}/>
							<p style={{'display':'inline','margin-left':'5%'}}>Cota: aqui</p>
							<button style={{"margin":"3px",'width':'50%','margin-left':'20%','background-color':'green','color':'white'}} type="subit">Aposta já</button>
						</Form>
					</div>
				</div>
			</>
				);
	}

	if(role == "Special")
		return(<>  
		<div className="sidebar" id="Leftbar">
		<input type="text" name="searchbar" placeholder="Procure por um jogo"
					style={{"margin-left":"1vh","border-radius":"10px","margin":"1vh",'width':'95%'}}/>
					
					<p style={{"margin-left":"1vh","border-radius":"10px","margin":"1vh"}}>
						Competições</p>
					<div className="competitions">
						{ligas.map((i,ind)=>(<button className='comp-button' style={{"border":"0px"}} key={ind}>{i}</button>))}
					</div>
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
			<input type="text" name="searchbar" placeholder="Procure por um jogo"
					style={{"margin-left":"1vh","border-radius":"10px","margin":"1vh",'width':'95%'}}/>
					
					<p style={{"margin-left":"1vh","border-radius":"10px","margin":"1vh"}}>
						Competições</p>
					<div className="competitions">
						{ligas.map((i,ind)=>(<button className='comp-button' style={{"border":"0px"}} key={ind}>{i}</button>))}
					</div>
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
		              	<input type="value" placeholder='valor' name="Valor" pattern="\d*[1-9](\.\d{1,2}|)" title="Intruduza montante válido" onChange={handleChange}/>
		              	<button style={{"margin":"3px"}} type="subit">Submeter</button>
		              </Form>
		            </div>
		        </div>
            </>
		);
	}
}