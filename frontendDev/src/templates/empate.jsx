import {parseBet,parseDate} from "../utils"

    /**
     * Component that render a Draw event to user
     * @params properties of the component with field event,addApost,escolhas
     * @returns Returns HTML for the component 
     */

export default function Empate({evento,addAposta,escolhas,follow,clickFollow}){

	function badge(){
		return(
		<span className="badge">
			<div style={{"display":"flex",'flexDirection':'row'}}>
				SuperOdd
				<img alt="" src="/medal.png" className="badgeimg" style={{"height":"50px"}}></img>
			</div>
		</span>
		)
	}

	return(
				<div className="bet-element" style={{"backgroundColor":"white"}}>
		            <div className="drawmatch">
						<p className="betinfo">{evento.Liga}</p>
		              	<div style={{"display":"flex",'flexDirection':'row','float':'left'}}>
							<img alt="" src={evento.Logos[0]} style={{"padding":"10px"}}></img>
		                	<p style={{}}>{evento.Participantes[0]} - {evento.Participantes[1]}</p>
							<img alt="" src={evento.Logos[1]} style={{"padding":"10px"}}></img>
		              	</div>
					  <p className="betinfo">{parseDate(evento.Data)}</p>
		            </div>
		            <div className="drawmatchodds">
				            <button className='odd-button' 
								style={(!evento.SuperOdds)?
									{"backgroundColor":(escolhas.includes(0))?"orange":"beige","color":(escolhas.includes(0))?"white":"black"}:
									{"backgroundColor":(escolhas.includes(0))?"purple":"plum","color":(escolhas.includes(0))?"white":"black"}} 
									onClick={()=>(addAposta(parseBet(evento,0)))}>home {evento.Odds[0].toFixed(2)}</button>
			              	<button className='odd-button' 
								style={(!evento.SuperOdds)?
									{"backgroundColor":(escolhas.includes(2))?"orange":"beige","color":(escolhas.includes(2))?"white":"black"}:
									{"backgroundColor":(escolhas.includes(2))?"purple":"plum","color":(escolhas.includes(2))?"white":"black"}} 
									onClick={()=>(addAposta(parseBet(evento,2)))}>draw {evento.Odds[2].toFixed(2)}</button>
							<button className='odd-button' 
								style={(!evento.SuperOdds)?
									{"backgroundColor":(escolhas.includes(1))?"orange":"beige","color":(escolhas.includes(1))?"white":"black"}:
									{"backgroundColor":(escolhas.includes(1))?"purple":"plum","color":(escolhas.includes(1))?"white":"black"}} 
									onClick={()=>(addAposta(parseBet(evento,1)))}>away {evento.Odds[1].toFixed(2)}</button>
		            	<div style={{"display":"flex","flexDirection":"column","justifyContent":"space-between"}}>
			            	<img src={(follow)?'/follow_on.png':'/follow_off.png'} style={{"height":"30px","cursor":"pointer"}} onClick={()=>(clickFollow(follow,evento.EventoId))}/>

							{evento.SuperOdds? badge():null}
						</div>
						
					</div>

	          	</div>
	);
}