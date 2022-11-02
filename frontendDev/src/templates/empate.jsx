import {parseBet} from "../utils"


export default function Empate({evento,addAposta}){
	return(
				<div className="bet-element">
		            <div className="drawmatch">
		              <img src={evento.Logos[0]} style={{"padding":"10px"}}></img>
		              <p>{evento.Participantes[0]} - {evento.Participantes[1]}</p>
		              <img src={evento.Logos[1]} style={{"padding":"10px"}}></img>
		            </div>
		            <div className="drawmatchodds">
		              <button style={{"margin":"15px"}} onClick={()=>(addAposta(parseBet(evento,0)))}>home {evento.Odds[0]}</button>
		              <button style={{"margin":"15px"}} onClick={()=>(addAposta(parseBet(evento,2)))}>draw {evento.Odds[2]}</button>
		              <button style={{"margin":"15px"}} onClick={()=>(addAposta(parseBet(evento,1)))}>away {evento.Odds[1]}</button>
		            </div>
	          	</div>
	);
}