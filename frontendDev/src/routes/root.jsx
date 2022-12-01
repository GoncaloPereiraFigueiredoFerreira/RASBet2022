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

  const width = window.innerWidth;
  
  if(width>1000){
   return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <img src='/logo.png' className = "button" onClick={()=>{navigation('/');}} style={{'width':'fit-content','height':'5vh',"margin-top":"1vh","margin-left":"1vh","background-color":"darkgreen"}}/>
              <p style={{'display':'inline','width':'fit-content',"color":"gold",'text-align': 'center','vertical-align': 'middle'}}> RASBet</p>        
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
              <img src='/perfil.png' style={{'width':'6vh','height':'6vh','margin':'0.5vh'}}/>
              <div className="dropdown-content">
                <Link to={`perfil/${token}`}>Perfil</Link>
                <Link to={`histT/${token}`}>Histórico Transações</Link>
                <Link to={`histA/${token}`}>Histórico Apostas</Link>
                <Link to={`login`}>Ir para login</Link>
              </div>
            </div>:null}
           
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
  else if(width<1000){
    return (
     <>
       <header>
         <nav>
           <ul>
           <li>
               <img src='/logo.png' class = "button" onClick={()=>{navigation('/');}} style={{'width':'fit-content','height':'5vh',"margin-top":"1vh","margin-left":"1vh","background-color":"darkgreen"}}/>
               <p style={{'display':'inline','width':'fit-content',"color":"gold",'text-align': 'center','vertical-align': 'middle'}}> RASBet</p>        
             </li>

            <div className="dropdown" style={{"float":"left"}}>
                <div className="dropbtn">Desportos</div>
                <div class="dropdown-content">
                  <Link to={`/sport/FUT`}>               
                    <img src='/football.png' style={{'width':'fit-content','height':'3vh'}}/>
                    Futebol
                  </Link>
                  <Link to={`/sport/FUTPT`}>               
                    <img src='/football.png' style={{'width':'fit-content','height':'3vh'}}/>
                    FutebolPT
                  </Link>
                  <Link to={`/sport/F1`}>               
                    <img src='/formula1.png' style={{'width':'fit-content','height':'3vh'}}/>
                    Formula 1
                  </Link>                  
                  <Link to={`/sport/FUTBSK`}>               
                    <img src='/basketball.png' style={{'width':'fit-content','height':'3vh'}}/>
                    Basquetebol
                  </Link>
                </div>
              </div>
 
             {(getRole() == "apostador")?
             <div className="dropdown">
               <img src='/perfil.jpg' style={{'width':'6vh','height':'3vh','margin':'1vh'}}/>
               <div class="dropdown-content">
                 <Link to={`perfil/${token}`}>Perfil</Link>
                 <Link to={`histT/${token}`}>Histórico Transações</Link>
                 <Link to={`histA/${token}`}>Histórico Apostas</Link>
                 <Link to={`wallet/${token}`}>Carteira: {myWallet.Valor}</Link>
                 <Link to={`login`}>Ir para Login</Link>
               </div>
             </div>:null}
            
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

}