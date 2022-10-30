import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigate} from "react-router-dom";
import './login.css'
import '../index.css'
export async function action({request,params}){
  const data = await request.formData();
  console.log(data);
  return redirect("/");
}

export default function HistA() {
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
            <p>Tipo: Multipla/simples</p>
            <div style={{"background-color":"gray","margin":"2px"}}>
                <p>Campeonato:</p>
                <p>HomeTeam vs AwayTeam</p>
                <p>Odd:</p>            
            </div>
            <div>
                <p>Aposta:</p>
                <p>Data: </p>
                <p>Estado: (da aposta/jogo)</p>                
            </div>


          </div>

          <div className="bet-element" id="Multipla">
            <p>Tipo: Multipla/simples</p>
            <div>
                <div style={{"background-color":"gray","margin":"2px"}} >
                    <p>Campeonato:</p>
                    <p>HomeTeam vs AwayTeam</p>
                    <p>Odd:</p>     
                </div>

                <div style={{"background-color":"gray","margin":"2px"}}>
                    <p>Campeonato:</p>
                    <p>HomeTeam vs AwayTeam</p>
                    <p>Odd:</p>
                </div>
            </div>
            <div>
                <p>Aposta:</p>
                <p>Multiplyer: </p>
                <p>Data: </p>
                <p>Estado: (da aposta/jogo)</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}