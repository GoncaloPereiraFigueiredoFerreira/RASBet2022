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

  function on() {
    document.getElementById("overlay").style.display = "flex";
  }
  
  function off() {
    document.getElementById("overlay").style.display = "none";
  }


  return(
  		<div class="bet-element">
            <div class="racematch">
              <img src={evento.Logos[evento.Participantes.length]} style={{"padding":"10px",'height':'11vh'}}/>
              <div>
                <p style={{'font-weight':'bold'}}>{evento.Liga}</p>
                <p style={{'font-weight':'bold'}}>{parseDate(evento.Data)}</p>
              </div>
            </div>
          <Form onSubmit={handleSubmit} style={{"padding":"10px"}}>

            <div id='overlay'>
              <div style={{"display":"flex",'flex-wrap':'wrap'}}>
                {test(evento.Participantes,evento.Odds).map((part,ind)=>(<>
                  <div key={ind.toString() + evento.Liga} style={{"display":"flex",'flex-direction':'row'}}>
                    <img src={evento.Logos[ind]} style={{'margin-top':'2vh',"height":"4vh"}} />
                    <a><input type="text" style={{"margin":"15px"}} placeholder={part} onChange={handleChange} pattern="\d*[1-9](\.\d{1,}|)" title="Intruduza valor superior a 1" name={ind}/></a>
                  </div>
                
                </>))}                
              </div>
              <div style={{"display":"flex", 'float':'right','margin-right':'0','margin-left':'auto'}}>
                <button style={{"height":"fit-content",'background-color':'orange','margin-top':'0','margin-bottom':'auto'}} onClick={()=>(off())} type="button">Sair</button>
                <button style={{"height":"fit-content",'background-color':'orange','margin-top':'0','margin-bottom':'auto','margin-right':'1vh','margin-left':'1vh'}} type="submit">Submeter</button>                
              </div>

            </div>
            <div style={{"display":"flex",'flex-direction':'column'}}>
              <button type="button" style={{"margin-bottom":"5px"}} onClick={()=>(on())}>Criar Odds</button>
              <button style={{"height":"fit-content",'background-color':'orange','margin-top':'auto','margin-bottom':'0'}} type="submit">Submeter</button>              
            </div>

          </Form>
        </div>     
  );
}