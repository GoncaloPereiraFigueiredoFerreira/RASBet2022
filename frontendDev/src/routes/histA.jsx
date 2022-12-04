import axios from 'axios'
import {getToken,parseDate} from  "../utils"
import {useLoaderData} from 'react-router-dom';

    /**
     * Fetch the historic of Bets data of the user
     * @param JSON whith filed perfilid that is the token of the user
     * @returns Returns the data if fetch sucessed or null
     */

export async function loader({params}){
  const token = params.perfilid;
  var ret;
  if(token == "undefined"){ret = null;}
  else ret = await axios({method:'GET',url:'http://localhost:8080/api/betHistory/',params:{"ApostadorID":token}}) 
      .then(function (response) {
        console.log("response",response);
        const data = response.data;
        return data.lista;
      })
      .catch(function (error) {
        console.log(error);
        return null;
      }); 
  return ret;
}

    /**
     * Component that render the historic of Bets page
     * @returns Returns HTML for the component 
     */

export default function HistA() {
    const list = useLoaderData();

  return (
    <>
      <div className = "box" style={{'marginTop':'20px','paddingTop':'30px'}}>
        <div className = "loginbox">
          <div className='bemvindo'>
            <p>Histórico de Apostas</p>
          </div>
          <table style={{"fontSize":"calc(5px + 0.5vw)"}}>
            <tr>
              <th>Tipo</th>
              <th>Campeonato:Jogo</th>
              <th>Montante</th>
              <th>Data</th>
              <th>Estado</th>
              <th>Odd</th>
            </tr>
          {list.map((evento)=>(

            <tr id={evento.Aridade} key={evento.ID} style={{'font-weight':'normal'}}>
              <th style={{'font-weight':'normal'}}>{evento.Aridade}</th>
              <th style={{'font-weight':'normal'}}>   
                {evento.Jogos.map((jogo,ind)=>(
                  <div style={{"margin":"2px"}} key={ind.toString()}>
                      <p style={{'font-weight':'bold'}}>{jogo.Liga}:</p>
                      <p>{jogo.Descricao}</p>            
                  </div>
                  ))}</th>
              <th style={{'font-weight':'normal'}}>{evento.Montante}</th>
              <th style={{'font-weight':'normal'}}>{parseDate(evento.DateAp)}</th>
              <th style={{'font-weight':'normal'}}>{evento.Estado}</th>
              <th style={{'font-weight':'normal'}}>{evento.Odd}</th>
            </tr>

          ))}
          </table>
        </div>
      </div>
    </>
  );
}