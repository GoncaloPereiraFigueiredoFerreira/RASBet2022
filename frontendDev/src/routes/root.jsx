import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigate} from "react-router-dom";
import Login from "./login";

import {getToken} from "../utils"

export default function Root(props) {
  const navigation = useNavigate();
  const token = getToken();

  return (
    <>
      <nav>
      <img src='logo.png'/>
      <Link to='/sport/FUT'>Futebol</Link>
      <Link to='/sport/F1'>Formula 1</Link>
      <Link to='/sport/BSK'>basquetebol</Link>
      <Link to={`perfil/${token}`}><img src='logo.jpg' style={{'width':'6vh','height':'3vh'}}/></Link>
      <button onClick={()=>{navigation('login')}}>ir para login</button>
      <h1>carteira:{props.wallet}</h1>
      </nav>
      <Outlet />
    </>
  );
}