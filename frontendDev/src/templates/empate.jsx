import {parseBet,parseDate} from "../utils"


export default function Empate({evento,addAposta,escolhas}){
	return(
				<div className="bet-element">
		            <div className="drawmatch">
		              <img src={evento.Logos[0]} style={{"padding":"10px"}}></img>
		              <div>
		                <p>{evento.Participantes[0]} - {evento.Participantes[1]}</p>
		                <p>{parseDate(evento.Data)}</p>
		              </div>
		              <img src={evento.Logos[1]} style={{"padding":"10px"}}></img>
		            </div>
		            <div className="drawmatchodds">
		              <button style={{"margin":"15px","backgroundColor":(escolhas.includes(0))?"red":"grey"}} onClick={()=>(addAposta(parseBet(evento,0)))}>home {evento.Odds[0]}</button>
		              <button style={{"margin":"15px","backgroundColor":(escolhas.includes(2))?"red":"grey"}} onClick={()=>(addAposta(parseBet(evento,2)))}>draw {evento.Odds[2]}</button>
		              <button style={{"margin":"15px","backgroundColor":(escolhas.includes(1))?"red":"grey"}} onClick={()=>(addAposta(parseBet(evento,1)))}>away {evento.Odds[1]}</button>
		            </div>
	          	</div>
	);
}