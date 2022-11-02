import {parseBet} from "../utils"

function test (part,odds){
  const ret = part.map(((elem,ind) =>([elem,odds[ind]].join(" "))));
  return ret;
}

export default function Race({evento,addAposta}){
  return(
  		<div class="bet-element" key={evento.EventoId.toString()}>
          <div class="racematch">
            <p>{evento.Liga}</p>
          </div>
        <div class="dropdown">
          <button style={{"padding":"20px","justify-content":"center"}}>show odds</button>
          <div class="dropdown-content">
              {test(evento.Participantes,evento.Odds).map((elem,ind)=>(<button onClick={()=>(addAposta(parseBet(evento,ind)))}>{elem}</button>))}
          </div>
        </div>
      </div>
  );
}