import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigate} from "react-router-dom";
import Login from "./login";
import axios from "axios";
import { useEffect,useState } from "react";
import {get_request,post_request} from "../requests"

import {getRToken,getToken,getWallet,getRole,setWallet as set,setNotification,getNotification,clear_storage} from "../utils"

    /**
     * Component that render the root page(this page is the bar)
     * @returns Returns HTML for the component 
     */


export default function Root() {
  const navigation = useNavigate();
  const token = getToken();
  const [ listening, setListening ] = useState(false);
  const [ myWallet,setMy ] = useState({Valor:getWallet()});
  const [ notify,setNotify ] = useState(getNotification());
  let events;

  useEffect( () => {
    if (getRole() == "apostador" && !listening) {
      events = new EventSource("http://localhost:8080/api/events/?token="+getToken());

      //events.onerror = (error) => {console.log("error sse:",error);}

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        if(parsedData.betInfo !== undefined){
          let nnotify = getNotification();
          nnotify.push(parsedData.betInfo)
          setNotify(nnotify);
          setNotification(nnotify);
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

  async function logout_request(){
     post_request("/logout/",{"refreshToken":getRToken()})
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
            <li style={{"marginRight":"10px"}}>    
              <div className="logo"> 
                <img alt="" src='/logo.png' onClick={()=>{navigation('/');}} 
                    className="logoimg" style={{'margin':'5px',"marginRight":"1px"}}/>
                <p className="logoname" style={{"marginBottom":"15px","marginTop":"20px"}}> RASBet</p>        
              </div>     
            </li>
            <li>
              <Link to='/sport/FUTPT'>
              <img alt="" src='/football.png' className="sporticon"/>
              1ª Liga
              </Link>
            </li>
            <li>
              <Link to='/sport/FUT'>
              <img alt="" src='/football.png' className="sporticon"/>
              Futebol
              </Link>
            </li>
            <li>
              <Link to='/sport/F1'>
              <img alt="" src='/formula1.png' className="sporticon"/>
              Formula 1
              </Link>
            </li>
            <li>
              <Link to='/sport/BSK'>
              <img alt="" src='/basketball.png' className="sporticon"/>
              NBA</Link>
            </li>
            <li>
              <Link to='/sport/NFL'>
              <img alt="" src='/nfl.png' className="sporticon"/>
              NFL</Link>
            </li>

            {(getRole() == "apostador")?
            <div className="dropdown" style={{'marginBottom':'0'}}>
              <img alt="" src='/perfil.png' className="profile" style={{'marginBottom':'0'}}/>
              <div className="dropdown-content">
                <Link to={`perfil/${token}`}>Perfil</Link>
                <Link to={`histT/${token}`}>Histórico Transações</Link>
                <Link to={`histA/${token}`}>Histórico Apostas</Link>
                {(width>1100)? null:<Link to={`wallet/${token}`}>Carteira: {myWallet.Valor}€</Link>}
                <Link to={`login`} onClick={()=>{logout_request();clear_storage();events.close()}}>Ir para login</Link>
              </div>
            </div>:null}

            {(getRole() == "apostador")?
            <div className="dropdown" style={{'marginBottom':'0'}}>
                  <a href="#" className="notification">
                    <span><img alt="" src='/bell.png' className="bell"/></span>
                    <span className="badge">{notify.length==0? null:notify.length}</span>
                  </a>
                  <div className="dropdown-content" style={{'top':'60px'}} >
                    {notify.map((e,ind)=>(<p style={{'cursor': 'pointer'}} onClick={()=>{let n = [... notify];n.splice(ind,1);setNotification(n);;setNotify(n)}} key={ind}>{e}</p>))}
                  </div>
                </div>
              :null}

            {(getRole() == "apostador" && width>1100)?<>
              <li style={{"float":"right","padding":"12px"}}>
                <button onClick={()=>{navigation(`wallet/${token}`)}}>
                  Carteira: {myWallet.Valor}€
                </button>
              </li>
              </>:null}

            {(getRole() == "Admin")?
            <>
              <li style={{"float":"right","padding":"8px","paddingTop":"12px"}}>
                <button onClick={()=>{logout_request();clear_storage();navigation(`login`);}}>
                  {(width>1100)? "Ir para Login":"Sair"}
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
                <button onClick={()=>{logout_request();clear_storage();navigation(`login`);}}>
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
                <img alt="" src='/logo.png' onClick={()=>{navigation('/');}} 
                    className="logoimg" style={{'margin':'5px',"marginRight":"1px"}}/>
              </div>
            </li>

            <div className="dropdown" style={{"float":"left"}}>
                <div className="dropbtn">Desportos</div>
                <div className="dropdown-content" style={{"left":"0"}}>
                  <Link to={`/sport/FUTPT`}>               
                    <img alt="" src='/football.png' className="sporticon"/>
                    FutebolPT
                  </Link>                  
                  <Link to={`/sport/FUT`}>               
                    <img alt="" src='/football.png' className="sporticon"/>
                    Futebol
                  </Link>
                  <Link to={`/sport/F1`}>               
                    <img alt="" src='/formula1.png' className="sporticon"/>
                    Formula 1
                  </Link>                  
                  <Link to={`/sport/BSK`}>               
                    <img alt="" src='/basketball.png' className="sporticon"/>
                    NBA
                  </Link>
                  <Link to={`/sport/NFL`}>               
                    <img alt="" src='/nfl.png' className="sporticon"/>
                    NFL
                  </Link>
                </div>
              </div>
 
             {(getRole() == "apostador")?
             <div className="dropdown">
               <img alt="" src='/perfil.png' className="profile"/>
               <div className="dropdown-content">
                 <Link to={`perfil/${token}`}>Perfil</Link>
                 <Link to={`histT/${token}`}>Histórico Transações</Link>
                 <Link to={`histA/${token}`}>Histórico Apostas</Link>
                 <Link to={`wallet/${token}`}>Carteira: {myWallet.Valor}€</Link>
                 <Link to={`login`}>Ir para Login</Link>
               </div>
             </div>:null}

             {(getRole() == "apostador")?

                <div className="dropdown" style={{'marginBottom':'0'}} onClick={()=>{let n = []; setNotification([]) ;setNotify(n)}}>
                  <a href="#" className="notification">
                    <span><img alt="" src='/bell.png' className="bell"/></span>
                    <span className="badge">{notify.length==0? null:notify.length}</span>
                  </a>
                  <div className="dropdown-content" style={{'top':'60px'}}>
                    {notify.map((e,ind)=>(<p style={{'cursor': 'pointer'}} onClick={()=>{let n = [... notify];n.splice(ind,1);setNotification(n);;setNotify(n)}} key={ind}>{e}</p>))}
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