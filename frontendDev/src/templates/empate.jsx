import {parseBet,parseDate} from "../utils"


export default function Empate({evento,addAposta}){

		
	return(
				<div className="bet-element">
		            <div className="drawmatch">
						<p style={{"margin":"0px",'font-weight':'bold'}}>{evento.Liga}</p>
		              	<div style={{"display":"flex",'flex-direction':'row','float':'left'}}>
							<img src={evento.Logos[0]} style={{"padding":"10px"}}></img>
		                	<p style={{}}>{evento.Participantes[0]} - {evento.Participantes[1]}</p>
							<img src={evento.Logos[1]} style={{"padding":"10px"}}></img>
		              	</div>
					  <p style={{"margin":"0px",'font-weight':'bold'}}>{parseDate(evento.Data)}</p>
		            </div>
		            <div className="drawmatchodds">
						<div>
				            <button className='odd-button' onClick={()=>(addAposta(parseBet(evento,0)))}>home {evento.Odds[0]}</button>
						</div>
						<div>
			              	<button className='odd-button' onClick={()=>(addAposta(parseBet(evento,2)))}>draw {evento.Odds[2]}</button>
						</div>
						<div>
							<button className='odd-button' onClick={()=>(addAposta(parseBet(evento,1)))}>away {evento.Odds[1]}</button>
						</div>

		            </div>
	          	</div>
	);
}