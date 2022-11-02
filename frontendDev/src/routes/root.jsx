import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigate} from "react-router-dom";
import Login from "./login";

import {getToken,getWallet,getRole} from "../utils"

export default function Root(props) {
  const navigation = useNavigate();
  const token = getToken();

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <img src='logo.png' style={{'width':'fit-content','height':'3vh'}} class = "button" onClick={()=>{navigation('/');}}/>
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
              Futebol
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
              <img src='perfil.jpg' style={{'width':'6vh','height':'3vh'}}/>
              <div class="dropdown-content">
                <Link to={`perfil/${token}`}>Perfil</Link>
                <Link to={`histT/${token}`}>Histórico Transações</Link>
                <Link to={`histA/${token}`}>Histórico Apostas</Link>
              </div>
            </div>:null}
           
            <li style={{"float":"right","padding":"14px"}}><button onClick={()=>{navigation('login')}}>ir para login</button></li>
            {(getRole() == "apostador")?<li style={{"float":"right","padding":"14px"}}><button onClick={()=>{navigation(`wallet/${token}`)}}>Carteira: {getWallet()} </button></li>:null}
          </ul>
        </nav>
      </header>
      <div className="mainpage">
        <Outlet />
      </div>
    </>
  );
}