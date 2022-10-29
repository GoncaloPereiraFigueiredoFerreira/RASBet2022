function test (part,odds){
  const ret = part.map(((elem,ind) =>([elem,odds[ind]].join(" "))));
  return ret;
}

export default function Race(evento){
  return(
  <>
  		<div class="bet-element">
          <div class="racematch">
            <img src="racelogo" style={{"padding":"10px"}}></img>
            <p>{evento.Liga}</p>
            <img src="racetrack" style={{"padding":"10px"}}></img>
          </div>
        <div class="dropdown">
          <button style={{"padding":"20px","justify-content":"center"}}>show odds</button>
          <div class="dropdown-content">
              {test(evento.Participantes,evento.Odds).map((elem)=>(<a>{elem}</a>))}
          </div>
        </div>
      </div>
	</>
  );
}