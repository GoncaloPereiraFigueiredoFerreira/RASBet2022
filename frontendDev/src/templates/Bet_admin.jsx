import {useState} from "react"
import {post_request} from "../requests"

import axios from "axios"
import {getToken,parseDate} from "../utils"
import {Form} from "react-router-dom"
import NPags from "./NPags"

		/**
     * Post request to admin cancel a bet
     * @param event
     * @param sport of the bet
     * @returns Returns the response if request sucessed or null
     */

async function cancelar_aposta(evento,sport){
	var data = {Token:getToken(),Evento:{EventoID:evento.EventoId.toString(),Desporto:sport}};
  var resp = await post_request('/closeEvent/',data)
  if (resp.error) resp = null
  else resp = resp.data
}

		/**
     * Post request to admin add a super odd to an event
     * @param JSON data to send in the Post request
     * @returns Returns the response if request sucessed or null
     */

async function add_Super_Odds(data){
  var resp = await post_request('/superOdds/',data)
  if (resp.error) resp = null
  else resp = resp.data
}

		/**
     * Component that render the events to the admin
     * @param JSON data that contain the field event and sport type
     * @returns Returns HTML for the component
     */

function Aux({evento,sport,update,ind}){
	var desc = "";
	if(evento.Tipo == "RaceEvent") desc = `${evento.Liga}`;
	else desc = `${evento.Participantes[0]} - ${evento.Participantes[1]}`
	//let input={token:getToken(),sport:sport,EventoID:evento.EventoId.toString()};
	const [input,setInput] = useState({token:getToken(),sport:sport,EventoID:evento.EventoId.toString()})
	const [error,setError] = useState("")

	function handleChange({target}){
		input[target.name] = target.value;
	}

	function handleSubmit(){
		if(input.multiplier){
			add_Super_Odds(input);
			setError("")
		}
		else{
			setError("Introduza um valor")
		}
	}

	const width = window.innerWidth;

	function phoneCancelButton(){
		return(
			<button type="button" style={{"height":"fit-content","width":"100%",'backgroundColor':'red','marginLeft':'auto','marginRight':'0','marginTop':'10px'}}
			 onClick={()=>{if(window.confirm("Deseja cancelar?")){if(cancelar_aposta(evento,sport)!=null);{update(ind);}}}}>Cancelar evento</button>

		)
	}

	function computerCancelButton(){
		return(
			<p style={{"margin":"0","marginRight":"10px",'float':'right','fontWeight':'bold','color':'red','fontSize':'25px','cursor': 'pointer'}} 
			onClick={()=>{if(window.confirm("Deseja cancelar?")){if(cancelar_aposta(evento,sport)!=null);{update(ind);}}}}>x</p>
		)
	}

	return(
				<div className="bet-element">
		            <div className="drawmatch">


		            	{(evento.Tipo=="RaceEvent")?<>            
						<img alt="" src={evento.Logos[evento.Participantes.length]} style={{"padding":"10px",'height':'110px'}}/>
            			<div>
                			<p style={{'fontWeight':'bold'}}>{evento.Liga}</p>
                			<p style={{'fontWeight':'bold'}}>{parseDate(evento.Data)}</p>
           			 	</div>
						</>:null}
		              	{(evento.Tipo!="RaceEvent")?<>
							<p style={{"margin":"0px",'fontWeight':'bold'}}>{evento.Liga}</p>
							<div style={{"display":"flex",'flexDirection':'row','float':'left'}}>
								<img alt="" src={evento.Logos[0]} style={{"padding":"10px"}}></img>
								<p style={{}}>{evento.Participantes[0]} - {evento.Participantes[1]}</p>
								<img alt="" src={evento.Logos[1]} style={{"padding":"10px"}}></img>
							</div>
							<p style={{"margin":"0px",'fontWeight':'bold'}}>{parseDate(evento.Data)}</p>
					  	</>:null}
		            </div>
					<div>
		            	<p>Estado:{evento.Estado}</p>
						<p>SuperOdds: {(evento.SuperOdds)? "Aplied":"Not aplied"}</p>
					</div>

		            <div className="drawmatchodds" style={(width>1000)? {'width':'30%'}:{}}>
		              <Form onSubmit={handleSubmit} style={{'dispaly':'flex','flexDirection':'column','justifyContent':'space-between','color':'red'}}>
						{(width>1000)? computerCancelButton():null}
						<input type="number" step="0.01" style={{"marginBottom":"10px","width":"100%"}} name="multiplier" placeholder="Super Odds" min="0.01" onChange={handleChange} pattern="\d+(\.\d+|)"/>
						{(error != "")?<p>{error}</p>:null}

						<button style={(width>1000)?
								{"height":"fit-content","width":"45%",'backgroundColor':'orange','marginLeft':'auto','marginRight':'0','float':'right'}:
								{"height":"fit-content","width":"100%",'backgroundColor':'orange','marginLeft':'auto','marginRight':'0'}}>Confirmar</button>
		              	{(width>1000)? null:phoneCancelButton()}
					  </Form>
		            </div>
	          	</div>
	);

}

  /**
   * funtion that checks if event pass the filters applied
   * @param filters applied
   * @param event
   * @returns a boolean if the event pass the filters applied
   */

function check(filter,evento){
	let ret = true;
	if (filter.ligas.size > 0){
		ret = filter.ligas.has(evento.Liga); 
	}
	if(ret && filter.name != ""){
		let str = evento.Participantes.join();
		str = str + evento.Liga + evento.Data;
		ret = (str.search(filter.name) >= 0)? true:false;
	}
	return ret;
}

    /**
     * Component that render a bet
     * @params properties of the component
     * @returns Returns HTML for the component 
     */

export default function Bet(props){
	const elem = 20;
	const [page,setPage] = useState(0);

	const filter = props.data.filter((evento)=>(check(props.filter,evento))); 
	const array = filter.slice(page * elem,(page+1) * (elem));

	return(
		<>
		{array.map((evento,ind)=>(<Aux evento={evento} sport={props.sport} update={props.update} ind={ind} key={ind.toString()+evento.EventoId}/>))}
		<NPags paginas={filter.length/elem} func={setPage} atual={page}/>
		</>);
}