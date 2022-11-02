import { Form } from 'react-router-dom'
import { getToken } from "../utils"
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
  let input = {sport:sportid,token:getToken(),Odds:evento.Participantes.map(()=>('1')),EventoId:evento.EventoId.toString()}; 

  function handleChange({target}){
    var aux = input;
    input.Odds[parseInt(target.name)] = target.value;
    input = input;
    console.log(input);
  } 

  async function handleSubmit(){
    await register_bet(input);
  }


  return(
  		<div class="bet-element">
            <div class="racematch">
              <p>{evento.Liga}</p>
            </div>
          <Form onSubmit={handleSubmit}>
            <div class="dropdown">
              <button style={{"padding":"20px","justify-content":"center"}}>show odds</button>
              <div class="dropdown-content">
                {test(evento.Participantes,evento.Odds).map((part,ind)=>(
                  <a><input type="text" style={{"margin":"15px"}} placeholder={part} onChange={handleChange} name={ind}/></a>
                ))}
              </div>
            </div>
            <button style={{"padding":"20px","justify-content":"center"}} type="submit">Submeter</button>
          </Form>
        </div>     
  );
}