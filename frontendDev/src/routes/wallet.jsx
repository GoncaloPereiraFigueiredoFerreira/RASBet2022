import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigate} from "react-router-dom";
import './login.css'
import '../index.css'
export async function action({request,params}){
  const data = await request.formData();
  console.log(data);
  return redirect("/");
}

export default function Wallet() {
    const navigation = useNavigate();

    function on() {
        document.getElementById("overlay").style.display = "block";
      }
      
      function off() {
        document.getElementById("overlay").style.display = "none";
      }

  return (
    <>
          <img src='logo.png' style={{'width':'6vh','height':'3vh',"padding":"14px"}} class = "button" onClick={()=>{navigation('/');}}/>

      <div className = "box">
        <div className = "loginbox">
          <div className='bemvindo'>
            <p>Wallet</p>
            <p>Montante:</p>
            <input style={{"width":"30%"}}type="text" placeholder='Montante a depositar'/>
            <button style={{"margin":"10px"}}>+</button>
          </div>

          <div id="overlay" onclick="off()">
            <div id="text">Overlay Text</div>
          </div>
          
          <button className = "button" style={{"margin-right":"30vh","margin-left":"30vh","width":"40%"}} onclick="on()">Depositar</button>

        </div>
      </div>
    </>
  );
}