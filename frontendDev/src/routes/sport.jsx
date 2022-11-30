import {useState} from 'react'
import {useLoaderData,Form} from 'react-router-dom';
import axios from "axios"	

import {getToken,getRole,getDate,getWallet} from "../utils"

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
	const [apostas,setApostas] = useState({simples:null,mult:[]});
	const [state,setState] = useState(true);
	const [input,setInput] = useState({Valor:0});
	const [filter,setFilter] = useState({"name":"","ligas":new Set([])})
	const {sportid,sport,cods,ligas} = useLoaderData();


	function sidebar(){

		return(
		<div className="sidebar" id="Leftbar">
			<input type="text" name="name" placeholder="Procure por um jogo" 
			onChange={({target})=>{let nfilter={...filter};nfilter.name=target.value;setFilter(nfilter);}}
			style={{"marginLeft":"1vh","borderRadius":"10px","margin":"1vh",'width':'95%'}}/>
			
			<p style={{"marginLeft":"1vh","borderRadius":"10px","margin":"1vh"}}>
				Competições</p>
			<div className="competitions">
				{ligas.map((i,ind)=>(<button className='comp-button' 
				style={{"border":"0px","backgroundColor":(filter.ligas.has(i)?"Red":"Grey")}} key={ind} 
				onClick={()=>{let nfilter={...filter};(nfilter.ligas.has(i))?nfilter.ligas.delete(i):nfilter.ligas.add(i);setFilter(nfilter)}}>{i}</button>))}
			</div>
	  </div>);
	 }

	const role = getRole();

	if(role == "apostador"){

		async function reg_bet(data){
		  var resp = axios({method:'POST',url:'http://localhost:8080/api/registerBet/',data:data}) 
		  .then(function (response) {
		    console.log("response",response);
		    const data = response.data;
		    input.check = false;

		  })
		  .catch(function (error) {
		    console.log(error);
		    return null;
		  });

		  return resp;
		}

		function handleChange({target}){
				let ninput = {...input};
		    ninput[target.name] = (target.value != "")?parseInt(target.value):0;
		    setInput(ninput);
		    console.log(input);
		} 
		function handleChangeCodS({target}){
			input[target.name] = target.value;
			input.check = false;
			setInput(input);
		}

		function handleSubmit(){
			if((apostas.simples != null || apostas.mult.length > 0) && window.confirm("Deseja apostar?")){
				if(state){
					var ret = null;
					var data = apostas.simples;
					data.Aposta.DateAp = getDate();
					data.Eventos = [data.Evento];
					delete data.Desc;
					delete data.Evento;
					data.Aposta.Montante = input.Valor;
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
					data.Aposta.Montante = input.Valor;
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
			napostas.mult = apostas.mult.filter((e)=>{console.log(e.Evento.EventoID != aposta.Evento.EventoID && e.Evento.Escolha != aposta.Evento.Escolha);if(e.Evento.EventoID != aposta.Evento.EventoID || e.Evento.Escolha != aposta.Evento.Escolha) return aposta});
			setApostas(napostas);			
		}

		return(
			<>
				{sidebar()}
				<div className="betpage">
					<Bet data={sport} addBet={addBet} filter={filter} apostas={apostas} state={state}/>
				</div>
				
				<div className="betzone" id="Rightbar">

					<div className="betbox" id="Simples">
						<div>
							<button className='bet-type-button' style={state?{'fontWeight':'bold','borderBottom':'2px solid gray'}:{'borderBottom':'1px solid lightgray'}} onClick={()=>(setState(true))}>Simples</button>
							<button className='bet-type-button' style={state?{'float':'right','borderBottom':'1px solid lightgray'}:{'fontWeight':'bold','float':'right','borderBottom':'2px solid gray'}} onClick={()=>(setState(false))}>Multiplas</button>
						</div>
						  	{state?(<>	
						  		{apostas.simples?(
							  		<div className="bet">
										<p style={{"margin":"0","margin-right":"1vh",'float':'right','fontWeight':'bold'}} onClick={()=>(rmBet(apostas.simples))}>x</p>
										<p style={{"margin":"1vh",'padding-left':'1vh','fontWeight':'bold','color':'gray'}}>
											{apostas.simples.Desc.Evento}</p>
										<p style={{"margin":"1vh",'padding-left':'1vh','fontWeight':'bold','color':'black'}}>
											Resultado: {apostas.simples.Desc.Aposta} {apostas.simples.Aposta.Odd}</p>	              	
							  		</div>):null
						  		}
							</>):(<>

					  	{apostas.mult.map((evento)=>(
							<div className="bet" key={"a_"+evento.Evento.EventoID+evento.Evento.Escolha}>
								<p style={{"margin":"0","margin-right":"1vh",'float':'right','fontWeight':'bold'}} onClick={()=>(rmBet(evento))}>x</p>
								<p style={{"margin":"1vh",'padding-left':'1vh','fontWeight':'bold','color':'gray'}}>
									{evento.Desc.Evento}</p>
								<p style={{"margin":"1vh",'padding-left':'1vh','fontWeight':'bold','color':'black'}}>
									Resultado: {evento.Desc.Aposta} {evento.Aposta.Odd}</p>	 
							</div>
					  	))}</>)}
						<Form onSubmit={handleSubmit_cod} style={{'margin':'1vh'}}>
							{(input.check)?<img style={{'width':'20px'}} src="/check.png"/>:null}
							<input type="value" placeholder='Codigo' name="codigo" onChange={handleChangeCodS} style={{'width':'60%'}}/>
							<button style={{'marginLeft':'5%','width':'30%','backgroundColor':'red','color':'white'}} type="subit">Aplicar</button>
						</Form>
						<Form onSubmit={handleSubmit}>
							<input type="number" placeholder='Aposta' name="Valor" pattern="\d*(\.\d{1,2}|)" max={getWallet()} title="Intruduza montante válido" onChange={handleChange} style={{'width':'60%'}}/>
							<p style={{'display':'inline','marginLeft':'5%'}}>Cota: {(((state)?((apostas.simples)?apostas.simples.Aposta.Odd:1):apostas.mult.map((e)=>(e.Aposta.Odd)).reduce((x,y)=>(x*y),1))*input.Valor).toFixed(2)}</p>
							<button style={{"margin":"3px",'width':'50%','marginLeft':'20%','backgroundColor':'green','color':'white'}} type="subit">Aposta já</button>
						</Form>
					</div>
				</div>
			</>
				);
	}

	if(role == "Special")
		return(<>  
		{sidebar()}
		<div className="betpage-spec">
			<Bet_spec data={sport} tipo={sportid} filter={filter}/>
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
	      {sidebar()}
				<div className="betpage">
					<Bet_admin data={sport} sport={sportid} filter={filter}/>
				</div>
				
				<div className="betzone" id="Rightbar">

		            <div className="betbox" id="Multiplas">
		              {cods.map((cod,ind)=>(
			              <div className="bet" key={cod}>
			                <p>Codigo:{cod.Codigo}</p>
			                <p>Valor:{cod.Valor}</p>
			                <button style={{"margin":"3px"}} onClick={()=>{rm_cod({Token:getToken(),Codigo:cod.Codigo});window.location.reload(false);}}>Cancelar</button>
			              </div>
		              ))}
		              <Form onSubmit={handleSubmit}>
		              	<input type="value" placeholder='Codigo' name="Codigo" onChange={handleChange}/>
		              	<input type="value" placeholder='valor' name="Valor" pattern="[1-9]\d*(\.\d{1,2}|)" title="Intruduza montante válido" onChange={handleChange}/>
		              	<button style={{"margin":"3px"}} type="subit">Submeter</button>
		              </Form>
		            </div>
		        </div>
            </>
		);
	}
}