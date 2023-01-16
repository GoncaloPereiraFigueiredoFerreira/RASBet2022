import axios from 'axios'
import {getToken,parseDate} from  "../utils"
import {useLoaderData} from 'react-router-dom';
import {get_request} from "../requests"

    /**
     * Fetch the historic of Bets data of the user
     * @param JSON whith filed perfilid that is the token of the user
     * @returns Returns the data if fetch sucessed or null
     */

export async function loader({params}){
  const token = params.perfilid;
  var ret;
  if(token == "undefined"){ret = null;}
  else ret = await get_request('/betHistory/',{"ApostadorID":token})
  if (ret.error) ret = null
  else ret = ret.data.lista
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
              <th>Escolha</th>
              <th>Estado</th>
              <th>Odd</th>
            </tr>
          {list.map((evento)=>(

            <tr id={evento.Aridade} key={evento.ID} className='tablefont'>
              <th className='tablefont'>{evento.Aridade}</th>
              <th className='tablefont'>   
                {evento.Jogos.map((jogo,ind)=>(
                  <div style={{"margin":"2px"}} key={ind.toString()}>
                      <p style={{'fontWeight':'bold'}}>{jogo.Liga}:</p>
                      <p>{jogo.Descricao}</p>            
                  </div>
                  ))}</th>
              <th className='tablefont'>{evento.Montante}</th>
              <th className='tablefont'>{parseDate(evento.DateAp)}</th>
              <th className='tablefont'>   
                {evento.Jogos.map((jogo,ind)=>(
                  <div style={{"margin":"2px"}} key={ind.toString()}>
                      <p style={{'fontWeight':'bold'}}>{jogo.Escolha}</p>          
                  </div>
                  ))}</th>
              <th className='tablefont'>{evento.Estado}</th>
              <th className='tablefont'>{evento.Odd}</th>
            </tr>

          ))}
          </table>
        </div>
      </div>
    </>
  );
}