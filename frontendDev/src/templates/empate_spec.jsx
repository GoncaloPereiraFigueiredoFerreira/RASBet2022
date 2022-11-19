import { useState } from 'react'
import { Form } from 'react-router-dom'
import { getToken,parseDate} from '../utils'
import axios from 'axios'

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

export default function Empate({evento,sportid}){
  let input = {sport:sportid,token:getToken(),Odds:[evento.Odds[0],evento.Odds[1],evento.Odds[2]],EventoId:evento.EventoId.toString()};

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
		 <div class="bet-element">
            <div class="drawmatch">
              <img src={evento.Logos[0]} style={{"padding":"10px"}}></img>
              <div>
                <p>{evento.Participantes[0]} - {evento.Participantes[1]}</p>
                <p>{parseDate(evento.Data)}</p>
              </div>
              <img src={evento.Logos[1]} style={{"padding":"10px"}}></img>
            </div>
            <div class="drawmatchodds">
	            <Form onSubmit={handleSubmit}>
	              <input type="text" style={{"margin":"10px"}} name="0" placeholder={`home odd ${evento.Odds[0]}`} pattern="\d*[1-9](\.\d{1,}|)" title="Intruduza valor superior a 1" onChange={handleChange}/>
	              <input type="text" style={{"margin":"10px"}} name="2" placeholder={`draw odd ${evento.Odds[2]}`} pattern="\d*[1-9](\.\d{1,}|)" title="Intruduza valor superior a 1" onChange={handleChange}/>
	              <input type="text" style={{"margin":"10px"}} name="1" placeholder={`away odd ${evento.Odds[1]}`} pattern="\d*[1-9](\.\d{1,}|)" title="Intruduza valor superior a 1" onChange={handleChange}/>
	              <button style={{"padding":"20px","justify-content":"center"}} type="submit">Submeter</button>  
	            </Form>
            </div>
          </div> 
	);
}