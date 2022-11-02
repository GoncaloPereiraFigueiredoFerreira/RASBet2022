import axios from 'axios'
import {getToken,setWallet,parseDate} from  "../utils"
import {useLoaderData} from 'react-router-dom';

export async function loader({params}){
  const token = params.perfilid;
  var ret;
  if(token == "undefined"){ret = null;}
  else ret = await axios({method:'GET',url:'http://localhost:8080/api/betHistory/',params:{"ApostadorID":token}}) 
      .then(function (response) {
        console.log("response",response);
        const data = response.data;
        setWallet(data.Balance);
        return data.lista;
      })
      .catch(function (error) {
        console.log(error);
        return null;
      }); 
  return ret;
}

export default function HistA() {
    const list = useLoaderData();

  return (
    <>
      <div className = "box">
        <div className = "loginbox">
          <div className='bemvindo'>
            <p>Histórico de Apostas</p>
          </div>

          {list.map((evento)=>(
            <div className="bet-element" id={evento.Aridade} key={evento.ID}>
            <p>Tipo: {evento.Aridade}</p>
            <div>
                {evento.Jogos.map((jogo,ind)=>(
                <div style={{"background-color":"gray","margin":"2px"}} key={ind.toString()}>
                    <p>Campeonato:{jogo.Liga}</p>
                    <p>{jogo.Descricao}</p>            
                </div>
                ))}
            </div>
            <div>
                <p>Aposta:{evento.Montante}</p>
                <p>Data:{parseDate(evento.DateAp)} </p>
                <p>Estado:{evento.Estado}</p>
                <p>Odd:{evento.Odd}</p>                
            </div>


          </div>
          ))}



        
        </div>
      </div>
    </>
  );
}