import {useState,useEffect} from 'react'
import {useLoaderData,Form} from 'react-router-dom';
import axios from "axios"	

import {getToken,getRole,getDate,getWallet} from "../utils"

import Bet from "../templates/Bet"
import Bet_spec from "../templates/Bet_spec"
import Bet_admin from "../templates/Bet_admin"

    /**
     * Post request to admintrador add a new promocinal code
     * @param JSON data to send in the Post request
     * @returns Returns the response if request sucessed or null
     */

async function add_cod(data){
  var resp = axios({method:'POST',url:'http://localhost:8080/api/addPromocao/',data:data}) 
  .then(function (response) {
    const data = response.data;
  })
  .catch(function (error) {
    return null;
  });

  return resp;
}

    /**
     * Post request to admintrador remove a promocinal code
     * @param JSON data to send in the Post request
     * @returns Returns the response if request sucessed or null
     */

async function rm_cod(data){
  var resp = axios({method:'POST',url:'http://localhost:8080/api/remPromocao/',data:data}) 
  .then(function (response) {
    const data = response.data;
  })
  .catch(function (error) {
    return null;
  });

  return resp;
}

    /**
     * Get request to discover if user as used that promocional code
     * @param JSON data to send in the Get request
     * @returns Returns the response if request sucessed or null
     */

async function used_cod(data){
  var resp = axios({method:'GET',url:'http://localhost:8080/api/usedCod/',params:data}) 
  .then(function (response) {
    const data = response.data;
    return data;
  })
  .catch(function (error) {
    return null;
  });

  return resp;
}

    /**
     * Fetch the list of events to display to the users and if user is an admin get all promocional codes
     * @param JSON whith filed perfilid that is the token of the user
     * @returns Returns the data if fetch sucessed or null
     */

export async function loader({params}){
	const token = getToken();
	var ret = await axios({method:'GET',url:'http://localhost:8080/api/eventList/',params:{"token":token,"sport":params.sportid}}) 
	  .then(function (response) {
	    const data = {sportid:(params.sportid)?params.sportid:"FUT",sport:response.data.EventList,ligas:response.data.Leagues};
	    return data;
	  })
	  .catch(function (error) {
	    return null;
	  });
	  if(getRole() == "Admin"){ret.cods =  await getCods()}
	return ret;
}

    /**
     * Fetch the all promocional codes in the system
     * @param JSON whith filed perfilid that is the token of the user
     * @returns Returns the data if fetch sucessed or null
     */

async function getCods(){
	const ret = await axios({method:'GET',url:'http://localhost:8080/api/getpromocoes/',params:{"Token":getToken()}}) 
	  .then(function (response) {
	    const data = response.data;
	    return data;
	  })
	  .catch(function (error) {
	    return null;
	  });
	return ret;
}

    /**
     * Component that render the sport page
     * @returns Returns HTML for the component 
     */

export default function Sport(){
	let {sportid,sport,cods,ligas} = useLoaderData();
	const [apostas,setApostas] = useState({simples:null,mult:[]});
	const [state,setState] = useState(true);
	const [input,setInput] = useState({Valor:0});
	const [filter,setFilter] = useState({"name":"","ligas":new Set([]),"sportid":sportid})
	const stateUpdate = useState(0);
	const width = window.innerWidth;

	function update(ind){stateUpdate[1](stateUpdate[0] + 1);sport = sport.splice(ind,1);}

	useEffect(()=>{
		if (sportid != filter.sportid){
			setFilter({"name":"","ligas":new Set([]),"sportid":sportid})
		}
	}
		,[stateUpdate[0]]);
  /**
   * Component that render the sidebar(filters of the page sport)
   * @returns Returns HTML for the component 
   */

	function sidebar(){
		
		return(
				<div className="sidebar" id="Leftbar">
					<input type="text" name="name" placeholder="Procure por um jogo" 
					onChange={({target})=>{let nfilter={...filter};nfilter.name=target.value;setFilter(nfilter);}}
					style={{"marginLeft":"10px","borderRadius":"10px","margin":"10px",'width':'95%'}}/>
					
					<p style={{"marginLeft":"10px","borderRadius":"10px","margin":"10px"}}>
						Competições</p>
					<div className="competitions">
						{ligas.map((i,ind)=>(<button className='comp-button' 
						style={{"border":"0px","backgroundColor":(filter.ligas.has(i)?"Lightgray":"White")}} key={ind} 
						onClick={()=>{let nfilter={...filter};(nfilter.ligas.has(i))?nfilter.ligas.delete(i):nfilter.ligas.add(i);setFilter(nfilter)}}>{i}</button>))}
					</div>
				</div>);
	 		}

	const role = getRole();

	if(role == "apostador"){


		/**
     * Post request to user do a new bet
     * @param JSON data to send in the Post request
     * @returns Returns the response if request sucessed or null
     */

		async function reg_bet(data){
		  var resp = axios({method:'POST',url:'http://localhost:8080/api/registerBet/',data:data}) 
		  .then(function (response) {
		    const data = response.data;
		    let ninput = {...input};
		    ninput.check = false;
		    setInput(ninput);
		  })
		  .catch(function (error) {
		    return null;
		  });

		  return resp;
		}

  /**
   * Handle changes in the input fields for a bet and turn them into floats 
   * @param input field that changed
   */

		function handleChange({target}){
				let ninput = {...input};
		    ninput[target.name] = (target.value != "")?parseFloat(target.value):0;
		    setInput(ninput);
		} 

  /**
   * Handle changes in the promocional code field
   * @param input field that changed
   */

		function handleChangeCodS({target}){
			input[target.name] = target.value;
			input.check = false;
			setInput(input);
		}

	/**
   * Handle submit of a form responsable for the bet
   * See if it is a simple or multiple bet and processes the data accordingly
   */

		function handleSubmit(){
			if((apostas.simples != null || apostas.mult.length > 0) && (input.check || input.Valor > 0) && window.confirm("Deseja apostar?")){
				if(state){
					var ret = null;
					var data = apostas.simples;
					data.Aposta.DateAp = getDate();
					data.Eventos = [data.Evento];
					delete data.Desc;
					delete data.Evento;
					data.Aposta.Montante = input.Valor;
					data.Aposta.Codigo = (input.check) ? input.codigo:null;
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
					ret = reg_bet(data);
					var napostas = {...apostas};
					napostas.mult = [];
					setApostas(napostas);
				}

			}
		}

	/**
   * Handle submit of a form responsable for the promocional code
   */

		async function handleSubmit_cod(){
			var ret = null;
			var data = {ApostadorID:getToken(),Codigo:input.codigo};
			ret = await used_cod(data);
			if(ret.Res == "Nao"){let ninput = {...input};ninput.check=true;ninput.codVal=ret.Valor;setInput(ninput);}
		}

  /**
   * adds a event to the corrent bet
   * @param event to be add to the bet
   */

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
		}

		function rmBet(aposta){
			var napostas = {...apostas};
			napostas.simples = (apostas.simples && apostas.simples.Evento.EventoID == aposta.Evento.EventoID && apostas.simples.Evento.Escolha == aposta.Evento.Escolha)?null:aposta;
			napostas.mult = apostas.mult.filter((e)=>{if(e.Evento.EventoID != aposta.Evento.EventoID || e.Evento.Escolha != aposta.Evento.Escolha) return aposta});
			setApostas(napostas);			
		}

		function on() {
			document.getElementById("overlay-main").style.display = "flex";
		}
			
		function off() {
			document.getElementById("overlay-main").style.display = "none";
		}

		if(width>1000){
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
								<button className='bet-type-button' style={state?{'float':'right','borderBottom':'1px solid lightgray'}:{'fontWeight':'bold','float':'right','borderBottom':'2px solid gray'}} onClick={()=>(setState(false))}>Múltiplas</button>
							</div>
								{state?(<>	
									{apostas.simples?(
										<div className="bet">
											<p style={{"margin":"0","marginRight":"10px",'float':'right','fontWeight':'bold'}} onClick={()=>(rmBet(apostas.simples))}>x</p>
											<p style={{"margin":"10px",'padding-left':'10px','fontWeight':'bold','color':'gray'}}>
												{apostas.simples.Desc.Evento}</p>
											<p style={{"margin":"10px",'padding-left':'10px','fontWeight':'bold','color':'black'}}>
												Resultado: {apostas.simples.Desc.Aposta} {parseFloat(apostas.simples.Aposta.Odd).toFixed(2)}</p>	              	
										</div>):null
									}
								</>):(<>

							{apostas.mult.map((evento)=>(
								<div className="bet" key={"a_"+evento.Evento.EventoID+evento.Evento.Escolha}>
									<p style={{"margin":"0","marginRight":"10px",'float':'right','fontWeight':'bold'}} onClick={()=>(rmBet(evento))}>x</p>
									<p style={{"margin":"10px",'padding-left':'10px','fontWeight':'bold','color':'gray'}}>
										{evento.Desc.Evento}</p>
									<p style={{"margin":"10px",'padding-left':'10px','fontWeight':'bold','color':'black'}}>
										Resultado: {evento.Desc.Aposta} {parseFloat(evento.Aposta.Odd).toFixed(2)}</p>	 
								</div>
							))}</>)}
							<Form onSubmit={handleSubmit_cod} style={{'margin':'10px'}}>
								{(input.check)?<img alt="" style={{'width':'20px'}} src="/check.png"/>:null}
								<input type="value" placeholder='Código' name="codigo" onChange={handleChangeCodS} style={{'width':'60%'}}/>
								<button style={{'width':'30%','backgroundColor':'red','color':'white',"float":"right","fontSize":"1vw"}} type="subit">Aplicar</button>
							</Form>
							<Form onSubmit={handleSubmit} style={{"display":"block"}}>
								<input type="number" step="0.01" placeholder='Aposta' name="Valor" pattern="\d*(\.\d{1,2}|)" max={getWallet()}  title="Intruduza montante válido" onChange={handleChange} style={{'marginLeft':'10px','width':'50%'}}/>
								<p style={{'display':'inline','marginRight':'10px','float':'right'}}>Cota: {(((state)?((apostas.simples)?apostas.simples.Aposta.Odd:1):apostas.mult.map((e)=>(e.Aposta.Odd)).reduce((x,y)=>(x*y),1))*(input.Valor+((input.check)?input.codVal:0))).toFixed(2)}</p>
								<button style={{"margin":"3px",'width':'50%','marginLeft':'25%','backgroundColor':'green','color':'white',"fontSize":"1vw"}} type="subit">Aposta já</button>
							</Form>
						</div>
					</div>
				</>
					);
		}
		else{
			return(
				<>
					<div className="betpage" style={{"width":"100%"}}>
						
						<button type="button" style={{"margin-bottom":"5px"}} onClick={()=>(on())}>Apostas</button>
						<div>
							<p>{()=>{let m = [];for(let i = 0;(i < sport.size /40);i++){m.push(i)};return m;}}</p>
						</div>
						<Bet data={sport} addBet={addBet} filter={filter} apostas={apostas} state={state}/>
					</div>
					
					<div id="overlay-main">

						<div className="betbox" id="Simples" style={{"margin":"auto","marginTop":"10px"}}>
							<div>
								<button className='bet-type-button' style={state?{'fontWeight':'bold','borderBottom':'2px solid gray'}:{'borderBottom':'1px solid lightgray'}} onClick={()=>(setState(true))}>Simples</button>
								<button className='bet-type-button' style={state?{'float':'right','borderBottom':'1px solid lightgray'}:{'fontWeight':'bold','float':'right','borderBottom':'2px solid gray'}} onClick={()=>(setState(false))}>Múltiplas</button>
							</div>
								{state?(<>	
									{apostas.simples?(
										<div className="bet">
											<p style={{"margin":"0","marginRight":"10px",'float':'right','fontWeight':'bold'}} onClick={()=>(rmBet(apostas.simples))}>x</p>
											<p style={{"margin":"10px",'padding-left':'10px','fontWeight':'bold','color':'gray'}}>
												{apostas.simples.Desc.Evento}</p>
											<p style={{"margin":"10px",'padding-left':'10px','fontWeight':'bold','color':'black'}}>
												Resultado: {apostas.simples.Desc.Aposta} {parseFloat(apostas.simples.Aposta.Odd).toFixed(2)}</p>	              	
										</div>):null
									}
								</>):(<>

							{apostas.mult.map((evento)=>(
								<div className="bet" key={"a_"+evento.Evento.EventoID+evento.Evento.Escolha}>
									<p style={{"margin":"0","marginRight":"10px",'float':'right','fontWeight':'bold'}} onClick={()=>(rmBet(evento))}>x</p>
									<p style={{"margin":"10px",'padding-left':'10px','fontWeight':'bold','color':'gray'}}>
										{evento.Desc.Evento}</p>
									<p style={{"margin":"10px",'padding-left':'10px','fontWeight':'bold','color':'black'}}>
										Resultado: {evento.Desc.Aposta} {parseFloat(evento.Aposta.Odd).toFixed(2)}</p>	 
								</div>
							))}</>)}
							<Form onSubmit={handleSubmit_cod} style={{'margin':'10px'}}>
								{(input.check)?<img alt="" style={{'width':'20px'}} src="/check.png"/>:null}
								<input type="value" placeholder='Código' name="codigo" onChange={handleChangeCodS} style={{'width':'60%'}}/>
								<button style={{'marginLeft':'5%','width':'30%','backgroundColor':'red','color':'white'}} type="subit">Aplicar</button>
							</Form>
							<Form onSubmit={handleSubmit}>
								<input type="number" placeholder='Aposta' name="Valor" pattern="\d*(\.\d{1,2}|)" max={getWallet()} title="Intruduza montante válido" onChange={handleChange} style={{'marginLeft':'5%','width':'60%'}}/>
								<p style={{'display':'inline','marginLeft':'5%'}}>Cota: {(((state)?((apostas.simples)?apostas.simples.Aposta.Odd:1):apostas.mult.map((e)=>(e.Aposta.Odd)).reduce((x,y)=>(x*y),1))*(input.Valor+((input.check)?input.codVal:0))).toFixed(2)}</p>
								<button style={{"margin":"3px",'width':'50%','marginLeft':'25%','backgroundColor':'green','color':'white'}} type="subit">Apostar</button>
							</Form>
						</div>
						<button type="button" style={{"margin-bottom":"5px"}} onClick={()=>(off())}>Sair</button>
					</div>
				</>
					);
		}
	}

	if(role == "Special")
		if(width>1000){
			return(<>  
			{sidebar()}
			<div className="betpage-spec">
				<Bet_spec data={sport} tipo={sportid} filter={filter} update={update}/>
			</div></>
					);
		}
		else{
			return(<>  
				<div className="betpage-spec" style={{"width":"100%"}}>
					<Bet_spec data={sport} tipo={sportid} filter={filter} update={update}/>
				</div></>
					);
		}
	if(role == "Admin"){

	/**
   * Handle changes in the input fields 
   * @param input field that changed
   */

		function handleChange({target}){
			input[target.name] = target.value;
			setInput(input);
		}

  /**
   * Handle submit of a form, send add promocional code request
   */

		function handleSubmit(){
			var data = {Token:getToken(),Promocao:input};
			add_cod(data);
		}

		function on() {
			document.getElementById("overlay-main").style.display = "flex";
		}
			
		function off() {
			document.getElementById("overlay-main").style.display = "none";
		}

		if(width>1000){
			return(
				<>
			{sidebar()}
					<div className="betpage">
						<Bet_admin data={sport} sport={sportid} filter={filter} update={update}/>
					</div>
					
					<div className="betzone" id="Rightbar">

						<div className="betbox" id="Multiplas">
							<div>
								<button className='bet-type-button' style={{'fontWeight':'bold','border-bottom':'2px solid gray','width':'100%'}}>Códigos Promocionais</button>
							</div>
						{cods.map((cod,ind)=>(
							<div className="bet" key={cod}>
								<p style={{"margin":"0","marginRight":"10px",'float':'right','fontWeight':'bold','color':'red'}} onClick={()=>{rm_cod({Token:getToken(),Codigo:cod.Codigo});update();cods = cods.splice(ind,1);}}>x</p>
								<p style={{"margin":"10px",'padding-left':'10px','fontWeight':'bold','color':'black','font-size':'large'}}>{cod.Codigo}</p>
								<p style={{"margin":"10px",'padding-left':'10px','fontWeight':'bold','color':'gray','font-size':'large'}}>{cod.Valor}€</p>
							</div>
						))}
						<Form onSubmit={handleSubmit}>
							<input style={{'marginLeft':'5%','width':'90%','margin-top':'10px'}} type="value" placeholder='Código' name="Codigo" onChange={handleChange}/>
							<input style={{'marginLeft':'5%','width':'90%','margin-top':'10px'}} type="value" placeholder='Valor' name="Valor" pattern="\d*(\.\d{1,2}|)" title="Intruduza montante válido" onChange={handleChange}/>
							<button style={{"margin":"3px",'width':'80%','marginLeft':'10%','margin-top':'10px','backgroundColor':'green','color':'white'}} type="subit">Criar</button>
						</Form>
						</div>
					</div>
				</>
			);
	}
	else{
		return(
			<>
				<div className="betpage" style={{"width":"100%"}}>
					<button type="button" style={{"margin-bottom":"5px"}} onClick={()=>(on())}>Códigos Promocionais</button>

					<Bet_admin data={sport} sport={sportid} filter={filter} update={update}/>
				</div>
				
				<div id="overlay-main">

					<div className="betbox" id="Multiplas" style={{"margin":"auto","marginTop":"10px"}}>
						<div>
							<button className='bet-type-button' style={{'fontWeight':'bold','border-bottom':'2px solid gray','width':'100%'}}>Códigos Promocionais</button>
						</div>
					{cods.map((cod)=>(
						<div className="bet" key={cod}>
							<p style={{"margin":"0","marginRight":"10px",'float':'right','fontWeight':'bold','color':'red'}} onClick={()=>rm_cod({Token:getToken(),Codigo:cod.Codigo})}>x</p>

							<p style={{"margin":"10px",'padding-left':'10px','fontWeight':'bold','color':'black','font-size':'large'}}>{cod.Codigo}</p>
							<p style={{"margin":"10px",'padding-left':'10px','fontWeight':'bold','color':'gray','font-size':'large'}}>{cod.Valor}€</p>
						</div>
					))}
					<Form onSubmit={handleSubmit}>
						<input style={{'marginLeft':'5%','width':'90%','margin-top':'10px'}} type="value" placeholder='Código' name="Codigo" onChange={handleChange}/>
						<input style={{'marginLeft':'5%','width':'90%','margin-top':'10px'}} type="number" step="0.01" placeholder='Valor' name="Valor" pattern="\d*(\.\d{1,2}|)" min="0.1" title="Intruduza montante válido" onChange={handleChange}/>
						<button style={{"margin":"3px",'width':'80%','marginLeft':'10%','margin-top':'10px','backgroundColor':'green','color':'white'}} type="subit">Criar</button>
					</Form>
					</div>
					<button type="button" style={{"margin":"auto","marginTop":"20px","backgroundColor":"orange"}} onClick={()=>(off())}>Sair</button>
				</div>
			</>
		);
	}

	}
}