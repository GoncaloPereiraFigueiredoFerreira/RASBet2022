import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigate} from "react-router-dom";
import Login from "./login";
import axios from "axios";
import { useEffect,useState } from "react";

import {getToken,getWallet,getRole,setWallet as set} from "../utils"

    /**
     * Component that render the root page(this page is the bar)
     * @returns Returns HTML for the component 
     */

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

    /**
     * GET request to register a new user
     * @returns Returns the data if request sucessed or null
     */

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
              <div className="logo"> 
                <img src='/logo.png' onClick={()=>{navigation('/');}} style={{'width':'50px','height':'50px','margin':'0.5vh',"marginRight":"0.1vh"}}/>
                <p style={{'display':'inline','width':'fit-content',"color":"gold","marginLeft":"0","marginBottom":"15px","marginTop":"20px"}}> RASBet</p>        
              </div>     
            </li>
            <li>
              <Link to='/sport/FUT'>
              <img src='/football.png' style={{'width':'25px','height':'25px'}}/>
              Futebol
              </Link>
            </li>
            <li>
              <Link to='/sport/FUTPT'>
              <img src='/football.png' style={{'width':'25px','height':'25px'}}/>
              FutebolPT
              </Link>
            </li>
            <li>
              <Link to='/sport/F1'>
              <img src='/formula1.png' style={{'width':'25px','height':'25px'}}/>
              Formula 1
              </Link>
            </li>
            <li>
              <Link to='/sport/BSK'>
              <img src='/basketball.png' style={{'width':'25px','height':'25px'}}/>
              Basquetebol</Link>
            </li>

            {(getRole() == "apostador")?
            <div className="dropdown">
              <img src='/perfil.png' style={{'width':'52.5px','height':'52.5px','margin':'0.5vh'}}/>
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
                  Carteira: {myWallet.Valor}€
                </button>
              </li>:null}
            {(getRole() == "Admin")?
            <>
              <li style={{"float":"right","padding":"1vh"}}>
                <button onClick={()=>{navigation(`login`)}}>
                  Ir para Login
                </button>
              </li>
              <li style={{"float":"right","padding":"1vh"}}>
                <button onClick={()=>{refresh();}}>
                  Refresh
                </button>
              </li>
            </>:null}
            {(getRole() == "Special")?
            <>
              <li style={{"float":"right","padding":"1vh"}}>
                <button onClick={()=>{navigation(`login`)}}>
                  Ir para Login
                </button>
              </li>
            </>:null}
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
              <div className="logo"> 
                <img src='/logo.png' onClick={()=>{navigation('/');}} style={{'width':'50px','height':'50px','margin':'0.5vh',"marginRight":"1vh"}}/>
              </div>
            </li>

            <div className="dropdown" style={{"float":"left"}}>
                <div className="dropbtn">Desportos</div>
                <div class="dropdown-content">
                  <Link to={`/sport/FUT`}>               
                    <img src='/football.png' style={{'width':'25px','height':'25px'}}/>
                    Futebol
                  </Link>
                  <Link to={`/sport/FUTPT`}>               
                    <img src='/football.png' style={{'width':'25px','height':'25px'}}/>
                    FutebolPT
                  </Link>
                  <Link to={`/sport/F1`}>               
                    <img src='/formula1.png' style={{'width':'25px','height':'25px'}}/>
                    Formula 1
                  </Link>                  
                  <Link to={`/sport/BSK`}>               
                    <img src='/basketball.png' style={{'width':'25px','height':'25px'}}/>
                    Basquetebol
                  </Link>
                </div>
              </div>
 
             {(getRole() == "apostador")?
             <div className="dropdown">
               <img src='/perfil.png' style={{'width':'52.5px','height':'52.5px','margin':'0.5vh'}}/>
               <div class="dropdown-content">
                 <Link to={`perfil/${token}`}>Perfil</Link>
                 <Link to={`histT/${token}`}>Histórico Transações</Link>
                 <Link to={`histA/${token}`}>Histórico Apostas</Link>
                 <Link to={`wallet/${token}`}>Carteira: {myWallet.Valor}€</Link>
                 <Link to={`login`}>Ir para Login</Link>
               </div>
             </div>:null}
            
             {(getRole() == "Admin")?
              <>
                <li style={{"float":"right","paddingTop":"1vh","paddingRight":"0.5vh"}}>
                <button onClick={()=>{navigation(`login`)}}>
                  Sair
                </button>
                </li>
                <li style={{"float":"right","paddingTop":"1vh","paddingRight":"0.5vh"}}>
                  <button onClick={()=>{refresh();}}>
                    Refresh
                  </button>
                </li>
              </>
               :null}
            {(getRole() == "Special")?
            <>
              <li style={{"float":"right","padding":"1vh"}}>
                <button onClick={()=>{navigation(`login`)}}>
                  Ir para Login
                </button>
              </li>
            </>:null}
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