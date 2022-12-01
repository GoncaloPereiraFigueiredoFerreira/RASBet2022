import {parseBet,parseDate} from "../utils"


export default function SemEmpate({evento,addAposta,escolhas}){
	return(
			<div class="bet-element" key={evento.EventoId.toString()}>
	            <div class="drawmatch">
	              <img src={evento.Logos[0]} style={{"padding":"10px"}}></img>
	              <div>
	                <p>{evento.Participantes[0]} - {evento.Participantes[1]}</p>
	                <p>{parseDate(evento.Data)}</p>
	              </div>
	              <img src={evento.Logos[1]} style={{"padding":"10px"}}></img>
	            </div>
	            <div class="drawmatchodds">
				  <button style={{"margin":"15px","backgroundColor":(escolhas.includes(0))?"red":"grey"}} onClick={()=>(addAposta(parseBet(evento,0)))}>home {evento.Odds[0].toFixed(2)}</button>
	              <button style={{"margin":"15px","backgroundColor":(escolhas.includes(1))?"red":"grey"}} onClick={()=>(addAposta(parseBet(evento,1)))}>away {evento.Odds[1].toFixed(2)}</button>
	            </div>
	          </div>
	);
}