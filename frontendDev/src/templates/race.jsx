import {parseBet,parseDate} from "../utils"

function test (part,odds){
  const ret = part.map(((elem,ind) =>([elem,odds[ind].toFixed(2)].join(" "))));
  return ret;
}

export default function Race({evento,addAposta,escolhas}){
  function on() {
    document.getElementById("overlay").style.display = "flex";
  }
  
  function off() {
    document.getElementById("overlay").style.display = "none";
  }

  return(
  		<div class="bet-element" key={evento.EventoId.toString()}>
          <div class="racematch">
            <img src={evento.Logos[evento.Participantes.length]} style={{"padding":"10px",'height':'11vh'}}/>
            <div>
                <p style={{'font-weight':'bold'}}>{evento.Liga}</p>
                <p style={{'font-weight':'bold'}}>{parseDate(evento.Data)}</p>
            </div>
          </div>

          <div id='overlay'>
              <div style={{"display":"flex",'flex-wrap':'wrap'}}>
                {test(evento.Participantes,evento.Odds).map((part,ind)=>(<>
                  <div key={ind.toString() + evento.Liga} style={{"display":"flex",'flex-direction':'column'}}>
                   
                    {test(evento.Participantes,evento.Odds).map((elem,ind)=>(<button className="comp-button" style={{'width':'100%','border-radius':'0',"backgroundColor":(escolhas.includes(ind))?"orange":"white","color":(escolhas.includes(0))?"white":"black"}} onClick={()=>(addAposta(parseBet(evento,ind)))}> <img src={evento.Logos[ind]} style={{"height":"4vh"}}/> {elem}</button>))}
                  </div>
                
                </>))}                
              </div>
              <button style={{"height":"fit-content",'background-color':'orange','margin-top':'0','margin-right':'1vh','margin-bottom':'auto','margin-left':'auto'}} onClick={()=>(off())} type="button">Sair</button>
            </div>

            <button type="button" style={{"margin-bottom":"5px"}} onClick={()=>(on())}>Escolher Aposta</button>
      </div>
  );
}