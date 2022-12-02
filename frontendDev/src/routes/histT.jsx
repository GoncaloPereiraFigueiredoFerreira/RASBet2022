import axios from 'axios'
import {getToken,parseDate} from  "../utils"
import {useLoaderData} from 'react-router-dom';

    /**
     * Fetch the historic of transaction data of the user
     * @param JSON whith filed perfilid that is the token of the user
     * @returns Returns the data if fetch sucessed or null
     */

export async function loader({params}){
  const token = params.perfilid;
  var ret;
  if(token == "undefined"){ret = null;}
  else ret = await axios({method:'GET',url:'http://localhost:8080/api/transHist/',params:{"ApostadorID":token}}) 
      .then(function (response) {
        console.log("response",response);
        const data = response.data;
        return data;
      })
      .catch(function (error) {
        console.log(error);
        return null;
      }); 
  return ret;
}

    /**
     * Component that render the historic of Transaction page
     * @returns Returns HTML for the component 
     */

export default function HistT() {
  const list = useLoaderData();

  return (
    <>
      <div className = "box" style={{'marginTop':'2vh','paddingTop':'3vh'}}>
        <div className = "loginbox" >
          <div className='bemvindo'>
            <p>Histórico de Transaçoes</p>
          </div>
            <table>
            <tr>
              <th>Montante</th>
              <th>Tipo</th>
              <th>Data</th>
            </tr>
            {list.lista.map((elem)=>(
            <tr id="Simples" key={elem.ID}>
              <th style={{'font-weight':'normal'}}>{elem.Valor}</th>
              <th style={{'font-weight':'normal'}}>{elem.Tipo}</th> 
              <th style={{'font-weight':'normal'}}>{parseDate(elem.DataTr)}</th>               
            </tr>
            ))}
          </table>
        </div>
      </div>
    </>
  );
}