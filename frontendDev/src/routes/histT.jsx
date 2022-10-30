import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigate} from "react-router-dom";
import './login.css'
import '../index.css'
export async function action({request,params}){
  const data = await request.formData();
  console.log(data);
  return redirect("/");
}

export default function HistT() {
    const navigation = useNavigate();
  return (
    <>
          <img src='logo.png' style={{'width':'6vh','height':'3vh',"padding":"14px"}} class = "button" onClick={()=>{navigation('/');}}/>

      <div className = "box">
        <div className = "loginbox">
          <div className='bemvindo'>
            <p>Histórico de Apostas</p>
          </div>
          <div className="bet-element" id="Simples">
            <div>
                <p>Montante:</p>
                <p>Meio:</p>                
            </div>

          </div>
        
        </div>
      </div>
    </>
  );
}