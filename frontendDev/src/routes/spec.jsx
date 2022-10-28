import { Outlet,Link,useLoaderData,Form,redirect,NavLink,useNavigate} from "react-router-dom";
import Login from "./login";
import "../index.css"

function getToken(){
  const tokenString = sessionStorage.getItem('token');
  console.log(tokenString);
  const userToken = JSON.parse(tokenString);
  console.log(userToken);
  return userToken?.token;
}

export default function Root() {
  const navigation = useNavigate();
  const token = getToken();

  //if(!token){console.log(token);return <Login />;}

  return (
    <>
      
      <header>
        <nav>
          <ul>
            <li>
              <img src='logo.png' style={{'width':'6vh','height':'3vh',"padding":"14px"}} class = "button" onClick={()=>{navigation('/');}}/>
            </li>
            <li><Link to='/sport/futebol'>Futebol</Link></li>
            <li><Link to='/sport/forml1'>Formula 1</Link></li>
            <li><Link to='/sport/basktbol'>Basquetebol</Link></li>

            <div class="dropdown">
              <img src='perfil.jpg' style={{'width':'6vh','height':'3vh',"padding":"14px"}}/>
              <div class="dropdown-content">
                <a href={`perfil/${token}`}>Perfil</a>
                <a href="#">Carteira</a>
                <a href="#">Histórico Transações</a>
                <a href="#">Histórico Apostas</a>
              </div>
            </div>
           
            <li style={{"float":"right","padding":"14px"}}><button onClick={()=>{navigation('login')}}>ir para login</button></li>

          </ul>
        </nav>
      </header>

      <div class="mainpage">
        <div class="sidebar" id="Leftbar">
          <p style={{"padding":"5px"}}>Competiçoes</p>
        </div>

        <div class="betpage-spec" id="Main">
          <div class="bet-element">
            <div class="drawmatch">
              <img src="hometeam" style={{"padding":"10px"}}></img>
              <p>HomeTeam - AwayTeam</p>
              <img src="awaytam" style={{"padding":"10px"}}></img>
            </div>
            <div class="drawmatchodds">
              <input type="text" style={{"margin":"10px"}} placeholder="home odd"/>
              <input type="text" style={{"margin":"10px"}} placeholder="draw odd"/>
              <input type="text" style={{"margin":"10px"}} placeholder="away odd"/>
              <button style={{"padding":"20px","justify-content":"center"}}>Submeter</button>  
            </div>
          </div> 

          <div class="bet-element">
            <div class="racematch">
              <img src="racelogo" style={{"padding":"10px"}}></img>
              <p>Nome da corrida</p>
              <img src="racetrack" style={{"padding":"10px"}}></img>
            </div>
          <div class="dropdown">
            <button style={{"padding":"20px","justify-content":"center"}}>show odds</button>
            <div class="dropdown-content">
                <a><input type="text" style={{"margin":"15px"}} placeholder="player 1"/></a>
                <a><input type="text" style={{"margin":"15px"}} placeholder="player 2"/></a>
                <a><input type="text" style={{"margin":"15px"}} placeholder="player 3"/></a>
                <a><input type="text" style={{"margin":"15px"}} placeholder="player 4"/></a>
                <a><input type="text" style={{"margin":"15px"}} placeholder="player 5"/></a>
            </div>
          </div>
          <button style={{"padding":"20px","justify-content":"center"}}>Submeter</button>
        </div>     
        </div>
      </div>
    <Outlet />
    </>
  );
}