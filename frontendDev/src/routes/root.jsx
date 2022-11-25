import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigate} from "react-router-dom";
import Login from "./login";
import axios from "axios";
import { useEffect,useState } from "react";

import {getToken,getWallet,getRole,setWallet as set} from "../utils"

export default function Root({wallet,setWallet}) {
  const navigation = useNavigate();
  const token = getToken();
  const [ listening, setListening ] = useState(false);
  const [ myWallet,setMy ] = useState({Valor:getWallet()});

  useEffect( () => {
    console.log(getRole(),listening);
    if (getRole() == "apostador" && !listening) {
      console.log("ola");
      const events = new EventSource("http://localhost:8080/api/events/?token="+getToken());
      console.log(events);

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log(parsedData);

        setMy({Valor:parsedData.Balance});
        set(parsedData.Balance);
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

  const money = getWallet();
  if(money != wallet.Valor) setWallet({Valor:getWallet()})

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <img src='logo.png' class = "button" onClick={()=>{navigation('/');}} style={{'width':'fit-content','height':'3vh',"margin-top":"1vh","margin-left":"1vh","background-color":"darkgreen"}}/>
              <p style={{'display':'inline','width':'fit-content',"color":"gold"}}> RASBet</p>        
            </li>
            <li>
              <Link to='/sport/FUT'>
              <img src='football.png' style={{'width':'fit-content','height':'3vh'}}/>
              Futebol
              </Link>
            </li>
            <li>
              <Link to='/sport/FUTPT'>
              <img src='football.png' style={{'width':'fit-content','height':'3vh'}}/>
              FutebolPT
              </Link>
            </li>
            <li>
              <Link to='/sport/F1'>
              <img src='formula1.png' style={{'width':'fit-content','height':'3vh'}}/>
              Formula 1
              </Link>
            </li>
            <li>
              <Link to='/sport/BSK'>
              <img src='basketball.png' style={{'width':'fit-content','height':'3vh'}}/>
              Basquetebol</Link>
            </li>

            {(getRole() == "apostador")?
            <div className="dropdown">
              <img src='perfil.jpg' style={{'width':'6vh','height':'3vh','margin':'1vh'}}/>
              <div class="dropdown-content">
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
                  Carteira: {wallet.Valor}
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