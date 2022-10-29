
export default function Empate(evento){
	return(
			<div class="bet-element">
	            <div class="drawmatch">
	              <img src="hometeam" style={{"padding":"10px"}}></img>
	              <p>{evento.Participantes[0]} - {evento.Participantes[1]}</p>
	              <img src="awaytam" style={{"padding":"10px"}}></img>
	            </div>
	            <div class="drawmatchodds">
	              <button style={{"margin":"15px"}}>home {evento.Odds[0]}</button>
	              <button style={{"margin":"15px"}}>draw {evento.Odds[2]}</button>
	              <button style={{"margin":"15px"}}>away {evento.Odds[1]}</button>
	            </div>
	          </div>
	);
}