import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigation} from "react-router-dom";
import Login from "./login";

function getToken(){
  const tokenString = sessionStorage.getItem('token');
  console.log(tokenString);
  const userToken = JSON.parse(tokenString);
  console.log(userToken);
  return userToken?.token;
}

export default function Root() {
  const navigation = useNavigation();
  const token = getToken();

  if(!token){console.log(token);return <Login />;}

  return (
    <>
      <nav>
      <img src='logo.png'/>
      <Link to='/sport/futebol'>Futebol</Link>
      <Link to='/sport/forml1'>Formula 1</Link>
      <Link to='/sport/basktbol'>basquetebol</Link>
      <a href={`perfil/${token}`}><img src='logo.jpg' style={{'width':'6vh','height':'3vh'}}/></a>
      </nav>
      <Outlet />
    </>
  );
}