import {parseBet,parseDate} from "../utils"

    /**
     * Component that render a NoDraw event to user
     * @params properties of the component with field event,addApost,escolhas
     * @returns Returns HTML for the component 
     */

export default function SemEmpate({evento,addAposta,escolhas}){
	return(
			<div className="bet-element" key={evento.EventoId.toString()}>
		        <div className="drawmatch">
					<p style={{"margin":"0px",'fontWeight':'bold'}}>{evento.Liga}</p>
		          	<div style={{"display":"flex",'flexDirection':'row','float':'left'}}>
						<img alt="" src={evento.Logos[0]} style={{"padding":"10px"}}></img>
	                	<p style={{}}>{evento.Participantes[0]} - {evento.Participantes[1]}</p>
						<img alt="" src={evento.Logos[1]} style={{"padding":"10px"}}></img>
	              	</div>
					<p style={{"margin":"0px",'fontWeight':'bold'}}>{parseDate(evento.Data)}</p>
		        </div>
	            <div className="drawmatchodds">
				  <button className="odd-button" style={{"backgroundColor":(escolhas.includes(0))?"orange":"beige","color":(escolhas.includes(0))?"white":"black"}} onClick={()=>(addAposta(parseBet(evento,0)))}>home {evento.Odds[0].toFixed(2)}</button>
	              <button className="odd-button" style={{"backgroundColor":(escolhas.includes(1))?"orange":"beige","color":(escolhas.includes(1))?"white":"black"}} onClick={()=>(addAposta(parseBet(evento,1)))}>away {evento.Odds[1].toFixed(2)}</button>
	            </div>
	          </div>
	);
}