import {parseBet,parseDate} from "../utils"

function test (part,odds){
  const ret = part.map(((elem,ind) =>([elem,odds[ind].toFixed(2)].join(" "))));
  return ret;
}

export default function Race({evento,addAposta,escolhas}){
  return(
  		<div className="bet-element" key={evento.EventoId.toString()}>
          <div className="racematch">
            <img src={evento.Logos[evento.Participantes.length]} style={{"padding":"10px"}}/>
            <div>
                <p>{evento.Liga}</p>
                <p>{parseDate(evento.Data)}</p>
            </div>
          </div>
        <div className="dropdown">
          <button style={{"padding":"20px","justify-content":"center"}}>show odds</button>
          <div className="dropdown-content">
              {test(evento.Participantes,evento.Odds).map((elem,ind)=>(<button style={{"backgroundColor":(escolhas.includes(ind))?"red":"grey"}} onClick={()=>(addAposta(parseBet(evento,ind)))}>{elem}</button>))}
          </div>
        </div>
      </div>
  );
}