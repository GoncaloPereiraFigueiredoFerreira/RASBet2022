import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigate} from "react-router-dom";
import './login.css'
import '../index.css'
export async function action({request,params}){
  const data = await request.formData();
  console.log(data);
  return redirect("/");
}

export default function Perfil() {
  const navigation = useNavigate();
  return (
    <>
      <img src='logo.png' style={{'width':'6vh','height':'3vh',"padding":"14px"}} class = "button" onClick={()=>{navigation('/');}}/>
      <div className = "box">
        <div className = "loginbox">
          <div className='bemvindo'>
            <p>Perfil</p>
          </div>
          <p>Nome Completo:</p>
          <p>Email:</p>
          <p>Data de nascimeto: </p>
          <p>Nif:</p>
          <p>CC:</p>
          <p>Morada:</p>
          <p>Telemovel:</p>

          <button className = "button" type="submit" style={{"margin-right":"30vh","margin-left":"30vh","width":"40%"}} >Edit</button>
        </div>
      </div>
    </>
  );
}