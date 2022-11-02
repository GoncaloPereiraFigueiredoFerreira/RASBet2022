import axios from 'axios'
import {getToken,setWallet,parseDate} from  "../utils"
import {useLoaderData} from 'react-router-dom';

export async function loader({params}){
  const token = params.perfilid;
  var ret;
  if(token == "undefined"){ret = null;}
  else ret = await axios({method:'GET',url:'http://localhost:8080/api/transHist/',params:{"ApostadorID":token}}) 
      .then(function (response) {
        console.log("response",response);
        const data = response.data;
        setWallet(data.Balance);
        return data;
      })
      .catch(function (error) {
        console.log(error);
        return null;
      }); 
  return ret;
}

export default function HistT() {
  const list = useLoaderData();

  return (
    <>
      <div className = "box">
        <div className = "loginbox">
          <div className='bemvindo'>
            <p>Histórico de Transaçoes</p>
          </div>
          {list.lista.map((elem)=>(
          <div className="bet-element" id="Simples" key={elem.ID}>
            <div>
                <p>Montante:{elem.Valor}</p>
                <p>Meio:{elem.Tipo}</p> 
                <p>Data:{parseDate(elem.DataTr)}</p>               
            </div>

          </div>
          ))}
        
        </div>
      </div>
    </>
  );
}