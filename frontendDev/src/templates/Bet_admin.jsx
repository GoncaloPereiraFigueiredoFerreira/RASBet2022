import axios from "axios"
import {getToken} from "../utils"
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
		              <img src="hometeam" style={{"padding":"10px"}}></img>
		              <p>{desc}</p>
		              <img src="awaytam" style={{"padding":"10px"}}></img>
		            </div>
		            <div className="drawmatchodds">
		              <button style={{"margin":"15px"}} onClick={()=>(cancelar_aposta(evento,sport))}>Cancelar Aposta</button>
		              <div>
		              <Form onSubmit={handleSubmit}>
		              	<input type="text" style={{"margin":"10px"}} name="multiplier" placeholder="Super Odds" onChange={handleChange}/>
		              	<button style={{"margin":"15px"}} >Confirmar</button>
		              </Form>
		              </div>
		            </div>
	          	</div>
	);
}


export default function Bet(props){
	return(<>{props.data.map((evento,ind)=>(<Aux evento={evento} sport={props.sport}key={ind.toString()}/>))}</>);
}