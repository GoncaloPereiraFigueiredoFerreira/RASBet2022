import { Form } from 'react-router-dom'
import { getToken,parseDate} from "../utils"
import axios from 'axios'

function test (part,odds){
  const ret = part.map(((elem,ind) =>([elem,odds[ind]].join(" "))));
  return ret;
}

async function register_bet(data){
  console.log(data);
   axios({method:'POST',url:'http://localhost:8080/api/addEventOdd/',data:data}) 
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

export default function Race({evento,sportid}){
  let input = {sport:sportid,token:getToken(),Odds:evento.Participantes.map((a,ind)=>(evento.Odds[ind])),EventoId:evento.EventoId.toString()}; 

  function handleChange({target}){
    var aux = input;
    input.Odds[parseInt(target.name)] = target.value;
    input = input;
    console.log(input);
  } 

  async function handleSubmit(){
    await register_bet(input);
    window.location.reload(false);
  }


  return(
  		<div className="bet-element">
            <div className="racematch">
              <img src={evento.Logos[evento.Participantes.length]} style={{"padding":"10px"}}/>
              <div>
                <p>{evento.Liga}</p>
                <p>{parseDate(evento.Data)}</p>
              </div>
            </div>
          <Form onSubmit={handleSubmit}>
            <div className="dropdown">
              <button style={{"padding":"20px","justify-content":"center"}}>show odds</button>
              <div className="dropdown-content">
                {test(evento.Participantes,evento.Odds).map((part,ind)=>(<>
                  <div key={ind.toString() + evento.Liga}>
                    <img src={evento.Logos[ind]} style={{"height":"10vh"}} />
                    <a><input type="text" style={{"margin":"15px"}} placeholder={part} onChange={handleChange} pattern="\d*[1-9](\.\d{1,}|)" title="Intruduza valor superior a 1" name={ind}/></a>
                  </div>
                </>))}
              </div>
            </div>
            <button style={{"padding":"20px","justify-content":"center"}} type="submit">Submeter</button>
          </Form>
        </div>     
  );
}