import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigate} from "react-router-dom";
import Login from "./login";
import axios from "axios";
import { useEffect,useState } from "react";

import {getToken,getWallet,getRole,setWallet as set} from "../utils"

export default function Root() {
  const navigation = useNavigate();
  const token = getToken();
  const [ listening, setListening ] = useState(false);
  const [ myWallet,setMy ] = useState({Valor:getWallet()});

  useEffect( () => {
    if (getRole() == "apostador" && !listening) {
      const events = new EventSource("http://localhost:8080/api/events/?token="+getToken());

      events.onerror = (error) => {console.log("error sse:",error);}

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log(parsedData);

        if(parsedData.Balance !== undefined){
          setMy({Valor:parsedData.Balance});
          set(parsedData.Balance);
        }
      };


      setListening(true);
    }
  },[listening]);

  async function refresh(){
    const ret = await axios({method:'GET',url:'http://localhost:8080/api/update/',params:{"token":getToken()}}) 
      .then(function (response) {
        console.log(response);
        const data = response.data;
        return data;
      })
      .catch(function (error) {
        console.log(error);
        return null;
      }); 
  }

  if(getRole() == "apostador"){
    const money = getWallet();
    if(money != myWallet.Valor) setMy({Valor:getWallet()})
  }

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <img src='/logo.png' className = "button" onClick={()=>{navigation('/');}} style={{'width':'fit-content','height':'3vh',"marginTop":"1vh","marginLeft":"1vh","backgroundColor":"darkgreen"}}/>
              <p style={{'display':'inline','width':'fit-content',"color":"gold"}}> RASBet</p>        
            </li>
            <li>
              <Link to='/sport/FUT'>
              <img src='/football.png' style={{'width':'fit-content','height':'3vh'}}/>
              Futebol
              </Link>
            </li>
            <li>
              <Link to='/sport/FUTPT'>
              <img src='/football.png' style={{'width':'fit-content','height':'3vh'}}/>
              FutebolPT
              </Link>
            </li>
            <li>
              <Link to='/sport/F1'>
              <img src='/formula1.png' style={{'width':'fit-content','height':'3vh'}}/>
              Formula 1
              </Link>
            </li>
            <li>
              <Link to='/sport/BSK'>
              <img src='/basketball.png' style={{'width':'fit-content','height':'3vh'}}/>
              Basquetebol</Link>
            </li>

            {(getRole() == "apostador")?
            <div className="dropdown">
              <img src='/perfil.png' style={{'width':'6vh','height':'3vh','margin':'1vh'}}/>
              <div className="dropdown-content">
                <Link to={`perfil/${token}`}>Perfil</Link>
                <Link to={`histT/${token}`}>Histórico Transações</Link>
                <Link to={`histA/${token}`}>Histórico Apostas</Link>
              </div>
            </div>:null}
           
            <li style={{"float":"right","padding":"1vh",'width':'auto','height':'auto'}}>
              <button onClick={()=>{navigation('login')}}>Ir para login</button>
            </li>
            {(getRole() == "apostador")?
              <li style={{"float":"right","padding":"1vh"}}>
                <button onClick={()=>{navigation(`wallet/${token}`)}}>
                  Carteira: {myWallet.Valor}
                </button>
              </li>:null}
            {(getRole() == "Admin")?
              <li style={{"float":"right","padding":"1vh"}}>
                <button onClick={()=>{refresh();}}>
                  Refresh
                </button>
              </li>:null}
          </ul>
        </nav>
      </header>
      <div className="mainpage">
        <Outlet />
      </div>
    </>
  );
}