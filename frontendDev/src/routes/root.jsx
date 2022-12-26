import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigate} from "react-router-dom";
import Login from "./login";
import axios from "axios";
import { useEffect,useState } from "react";
import {get_request} from "../requests"

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
  const [ notify,setNotify ] = useState([]);

  useEffect( () => {
    if (getRole() == "apostador" && !listening) {
      const events = new EventSource("http://localhost:8080/api/events/?token="+getToken());

      //events.onerror = (error) => {console.log("error sse:",error);}

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        if(parsedData.betInfo !== undefined){
          let nnotify = [... notify]
          nnotify.push(parsedData.betInfo)
          setNotify(nnotify)
        }

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
    const ret = await get_request('/update/',{"token":getToken()})
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
                <img alt="" src='/logo.png' onClick={()=>{navigation('/');}} style={{'width':'50px','height':'50px','margin':'5px',"marginRight":"1px"}}/>
                <p style={{'display':'inline','width':'fit-content',"color":"gold","marginLeft":"0","marginBottom":"15px","marginTop":"20px"}}> RASBet</p>        
              </div>     
            </li>
            <li>
              <Link to='/sport/FUTPT'>
              <img alt="" src='/football.png' style={{'width':'25px','height':'25px'}}/>
              FutebolPT
              </Link>
            </li>
            <li>
              <Link to='/sport/FUT'>
              <img alt="" src='/football.png' style={{'width':'25px','height':'25px'}}/>
              Futebol
              </Link>
            </li>
            <li>
              <Link to='/sport/F1'>
              <img alt="" src='/formula1.png' style={{'width':'25px','height':'25px'}}/>
              Formula 1
              </Link>
            </li>
            <li>
              <Link to='/sport/BSK'>
              <img alt="" src='/basketball.png' style={{'width':'25px','height':'25px'}}/>
              Basquetebol</Link>
            </li>

            {(getRole() == "apostador")?
            <div className="dropdown" style={{'marginBottom':'0'}}>
              <img alt="" src='/perfil.png' style={{'width':'52.5px','height':'52.5px','margin':'5px','marginBottom':'0'}}/>
              <div className="dropdown-content">
                <Link to={`perfil/${token}`}>Perfil</Link>
                <Link to={`histT/${token}`}>Histórico Transações</Link>
                <Link to={`histA/${token}`}>Histórico Apostas</Link>
                <Link to={`login`}>Ir para login</Link>
              </div>
            </div>:null}

            {(getRole() == "apostador")?
            <div className="dropdown" style={{'marginBottom':'0'}} onClick={()=>{let n = []; setNotify(n)}}>
                  <a href="#" class="notification">
                    <span><img alt="" src='/bell.png' style={{'width':'40px','height':'40px','margin':'5px','marginTop':'12.5px','border': '3px solid darkgreen'}}/></span>
                    <span class="badge">{notify.length==0? null:notify.length}</span>
                  </a>
                  <div className="dropdown-content" style={{'top':'60px'}} >
                    {notify.map((e)=>(<p style={{'cursor': 'pointer'}}>{e}</p>))}
                  </div>
                </div>
              :null}

            {(getRole() == "apostador")?<>
              <li style={{"float":"right","padding":"12px",'cursor': 'pointer'}}>
                <button onClick={()=>{navigation(`wallet/${token}`)}}>
                  Carteira: {myWallet.Valor}€
                </button>
              </li>
              </>:null}

            {(getRole() == "Admin")?
            <>
              <li style={{"float":"right","padding":"8px","paddingTop":"12px"}}>
                <button onClick={()=>{navigation(`login`)}}>
                  Ir para Login
                </button>
              </li>
              <li style={{"float":"right","padding":"8px","paddingTop":"12px"}}>
                <button onClick={()=>{refresh();}}>
                  Refresh
                </button>
              </li>
            </>:null}

            {(getRole() == "Special")?
            <>
              <li style={{"float":"right","padding":"12px"}}>
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
                <img alt="" src='/logo.png' onClick={()=>{navigation('/');}} style={{'width':'50px','height':'50px','margin':'5px',"marginRight":"1px"}}/>
              </div>
            </li>

            <div className="dropdown" style={{"float":"left"}}>
                <div className="dropbtn">Desportos</div>
                <div class="dropdown-content" style={{"left":"0"}}>
                  <Link to={`/sport/FUTPT`}>               
                    <img alt="" src='/football.png' style={{'width':'25px','height':'25px'}}/>
                    FutebolPT
                  </Link>                  
                  <Link to={`/sport/FUT`}>               
                    <img alt="" src='/football.png' style={{'width':'25px','height':'25px'}}/>
                    Futebol
                  </Link>
                  <Link to={`/sport/F1`}>               
                    <img alt="" src='/formula1.png' style={{'width':'25px','height':'25px'}}/>
                    Formula 1
                  </Link>                  
                  <Link to={`/sport/BSK`}>               
                    <img alt="" src='/basketball.png' style={{'width':'25px','height':'25px'}}/>
                    Basquetebol
                  </Link>
                </div>
              </div>
 
             {(getRole() == "apostador")?
             <div className="dropdown">
               <img alt="" src='/perfil.png' style={{'width':'52.5px','height':'52.5px','margin':'5px'}}/>
               <div class="dropdown-content">
                 <Link to={`perfil/${token}`}>Perfil</Link>
                 <Link to={`histT/${token}`}>Histórico Transações</Link>
                 <Link to={`histA/${token}`}>Histórico Apostas</Link>
                 <Link to={`wallet/${token}`}>Carteira: {myWallet.Valor}€</Link>
                 <Link to={`login`}>Ir para Login</Link>
               </div>
             </div>:null}

             {(getRole() == "apostador")?

                <div className="dropdown" style={{'marginBottom':'0'}} onClick={()=>{let n = []; setNotify(n)}}>
                  <a href="#" class="notification">
                    <span><img alt="" src='/bell.png' style={{'width':'40px','height':'40px','margin':'5px','marginTop':'12.5px','border': '3px solid darkgreen'}}/></span>
                    <span class="badge">{notify.length==0? null:notify.length}</span>
                  </a>
                  <div className="dropdown-content" style={{'top':'60px'}}>
                    {notify.map((e)=>(<p style={{'cursor': 'pointer'}}>{e}</p>))}
                  </div>
                </div>
              :null}
            
             {(getRole() == "Admin")?
              <>
                <li style={{"float":"right","paddingTop":"12px","paddingRight":"5px"}}>
                <button onClick={()=>{navigation(`login`)}}>
                  Sair
                </button>
                </li>
                <li style={{"float":"right","paddingTop":"12px","paddingRight":"5px"}}>
                  <button onClick={()=>{refresh();}}>
                    Refresh
                  </button>
                </li>
              </>
               :null}
            {(getRole() == "Special")?
            <>
              <li style={{"float":"right","padding":"12px"}}>
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