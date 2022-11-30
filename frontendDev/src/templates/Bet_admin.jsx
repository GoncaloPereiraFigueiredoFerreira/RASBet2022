import axios from "axios"
import {getToken,parseDate} from "../utils"
import {Form} from "react-router-dom"

async function cancelar_aposta(evento,sport){
	var data = {Token:getToken(),Evento:{EventoID:evento.EventoId,Desporto:sport}};
   var resp = axios({method:'POST',url:'http://localhost:8080/api/closeEvent/',data:data}) 
  .then(function (response) {
    console.log("response",response);
    const data = response.data;
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });
}

async function add_Super_Odds(data){
   var resp = axios({method:'POST',url:'http://localhost:8080/api/superOdds/',data:data}) 
  .then(function (response) {
    console.log("response",response);
    const data = response.data;
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });
}


function Aux({evento,sport}){
	var desc = "";
	if(evento.Tipo == "RaceEvent") desc = `${evento.Liga}`;
	else desc = `${evento.Participantes[0]} - ${evento.Participantes[1]}`
	var input={token:getToken,sport:sport,EventoID:evento.EventoId};

	function handleChange({target}){
		input[target.name] = target.value;
	}

	function handleSubmit(){
		console.log("input",input);
		add_Super_Odds(input);
	}


	return(
				<div className="bet-element">
		            <div className="drawmatch">
		            	{(evento.Tipo=="RaceEvent")?<img src={evento.Logos[evento.Participantes.length]} style={{"padding":"10px"}}></img>:null}
		              {(evento.Tipo!="RaceEvent")?<img src={evento.Logos[0]} style={{"padding":"10px"}}></img>:null}
		              <div>
		              	<p>{desc}</p>
		              	<p>{parseDate(evento.Data)}</p>
		              </div>
		              {(evento.Tipo!="RaceEvent")?<img src={evento.Logos[1]} style={{"padding":"10px"}}></img>:null}
		            </div>
		            <div className="drawmatchodds">
		              <button style={{"margin":"15px"}} onClick={()=>{if(window.confirm("Deseja cancelar?")){cancelar_aposta(evento,sport);/*window.location.reload(false);*/}}}>Cancelar Aposta</button>
		              <div>
		              <Form onSubmit={handleSubmit}>
		              	<input type="text" style={{"margin":"10px"}} name="multiplier" placeholder="Super Odds" onChange={handleChange} pattern="\d*(.\d+|)"/>
		              	<button style={{"margin":"15px"}} >Confirmar</button>
		              </Form>
		              </div>
		            </div>
	          	</div>
	);
}

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


export default function Bet(props){
	return(<>{props.data.map((evento,ind)=>((check(props.filter,evento))?<Aux evento={evento} sport={props.sport}key={ind.toString()}/>:null))}</>);
}