import {parseBet,parseDate} from "../utils"

    /**
     * Function that aggregates odd an name of a pilot
     * @params list of pilots
     * @params  list of odds
     * @returns Returns a combination of the two lists 
     */

function test (part,odds){
  const ret = part.map(((elem,ind) =>([elem,odds[ind].toFixed(2)].join(" "))));
  return ret;
}

    /**
     * Component that render a Race event to an user
     * @params properties of the component
     * @returns Returns HTML for the component 
     */

export default function Race({evento,addAposta,escolhas}){
  function on() {
    document.getElementById("overlay").style.display = "flex";
  }
  
  function off() {
    document.getElementById("overlay").style.display = "none";
  }

  return(<>
  		<div className="bet-element" key={evento.EventoId.toString()}>
          <div className="racematch">
            <img src={evento.Logos[evento.Participantes.length]} style={{"padding":"10px",'height':'110px'}}/>
            <div>
                <p style={{'fontWeight':'bold'}}>{evento.Liga}</p>
                <p style={{'fontWeight':'bold'}}>{parseDate(evento.Data)}</p>
            </div>
          </div>

          <div id='overlay'>
              <div style={{"display":"flex",'flexWrap':'wrap'}}>
                {test(evento.Participantes,evento.Odds).map((part,ind)=>(<>
                  <div  style={{"display":"flex",'flexDirection':'column'}} key={ind.toString() + evento.Liga}>
                   
                    {(<button className="comp-button" 
                              style={{'width':'100%','borderRadius':'0',"backgroundColor":(escolhas.includes(ind))?"red":"grey"}} 
                              onClick={()=>(addAposta(parseBet(evento,ind)))}> 
                                <img src={evento.Logos[ind]} style={{"height":"40px"}}/>
                                {part}
                      </button>)}
                  </div>
                
                </>))}                
              </div>
              <button style={{"height":"fitContent",'backgroundColor':'orange','marginTop':'0','marginRight':'10px','marginBottom':'auto','marginLeft':'auto'}} onClick={()=>(off())} type="button">Sair</button>
            </div>

            <button type="button" style={{"marginBottom":"5px"}} onClick={()=>(on())}>Escolher Aposta</button>
      </div></>
  );
}