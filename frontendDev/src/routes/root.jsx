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

            <div className="dropdown">
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

      <div className="mainpage">
        <div className="sidebar" id="Leftbar">
          <p style={{"padding":"5px"}}>Competiçoes</p>
        </div>

        <div className="betpage" id="Main">
          <div className="bet-element">
            <div className="drawmatch">
              <img src="hometeam" style={{"padding":"10px"}}></img>
              <p>HomeTeam - AwayTeam</p>
              <img src="awaytam" style={{"padding":"10px"}}></img>
            </div>
            <div class="drawmatchodds">
              <button style={{"margin":"15px"}}>home odd</button>
              <button style={{"margin":"15px"}}>draw odd</button>
              <button style={{"margin":"15px"}}>away odd</button>
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
                <a>player1   1.3</a>
                <a>player2   1.3</a>
                <a>player3   1.3</a>                  <a>player4   1.3</a>
                <a>player5   1.3</a>
            </div>
          </div>
        </div>     
        </div>
          <div className="betzone" id="Rightbar">

            <div className="betbox" id="Simples">
              <button style={{"margin":"3px"}}>Simples</button>
              <div className="bet">
                <p>HomeTeam - AwayTeam</p>
                <p>Bet: HomeTeam</p>
                <p>Odd: 1.3</p>
                <input type="text" placeholder='Aposta'/>
                <button style={{"margin":"3px"}}>Cancelar</button>
              </div>
              <button style={{"margin":"3px"}}>Submeter</button>
            </div>

            <div className="betbox" id="Multiplas">
              <button style={{"margin":"3px"}}>Multiplas</button>
              <div className="bet">
                <p>HomeTeam - AwayTeam</p>
                <p>Bet: HomeTeam</p>
                <p>Odd: 1.3</p>
                <input type="text" placeholder='Aposta'/>
                <button style={{"margin":"3px"}}>Cancelar</button>
              </div>
              <div className="bet">
                <p>HomeTeam - AwayTeam</p>
                <p>Bet: HomeTeam</p>
                <p>Odd: 1.3</p>
                <input type="text" placeholder='Aposta'/>
                <button style={{"margin":"3px"}}>Cancelar</button>
              </div>
              
              
              <p type="value" placeholder='Aposta'/>
              <button style={{"margin":"3px"}}>Submeter</button>
            </div>
          </div>
      </div>
    <Outlet />
    </>
  );
}