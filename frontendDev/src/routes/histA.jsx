import axios from 'axios'
import {getToken,setWallet} from  "../utils"
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
        return data;
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
          <div className="bet-element" id="Simples">
            <p>Tipo: Multipla/simples</p>
            <div style={{"background-color":"gray","margin":"2px"}}>
                <p>Campeonato:</p>
                <p>HomeTeam vs AwayTeam</p>
                <p>Odd:</p>            
            </div>
            <div>
                <p>Aposta:</p>
                <p>Data: </p>
                <p>Estado: (da aposta/jogo)</p>                
            </div>


          </div>

          <div className="bet-element" id="Multipla">
            <p>Tipo: Multipla/simples</p>
            <div>
                <div style={{"background-color":"gray","margin":"2px"}} >
                    <p>Campeonato:</p>
                    <p>HomeTeam vs AwayTeam</p>
                    <p>Odd:</p>     
                </div>

                <div style={{"background-color":"gray","margin":"2px"}}>
                    <p>Campeonato:</p>
                    <p>HomeTeam vs AwayTeam</p>
                    <p>Odd:</p>
                </div>
            </div>
            <div>
                <p>Aposta:</p>
                <p>Multiplyer: </p>
                <p>Data: </p>
                <p>Estado: (da aposta/jogo)</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}