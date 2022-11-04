import {Form} from "react-router-dom"
import {useState} from "react"
import axios from "axios"
import {getDate,getToken,setWallet} from "../utils"

export default function Wallet({set}) {
    const [input,setInput] = useState({Valor:0});


    function Levantar(){
      var data={Valor:input.Valor,Tipo:"Levantamento_Conta",ApostadorID:getToken(),DataTR:getDate()};
      console.log(data);
      var resp = axios({method:'POST',url:'http://localhost:8080/api/transaction/',data:data}) 
      .then(function (response) {
        console.log(response);
        const data = response.data;
        setWallet(data.Balance);
        set({Valor:data.Balance});
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    function Depositar(){
      var data={Valor:input.Valor,Tipo:"Deposito_Conta",ApostadorID:getToken(),DataTR:getDate()};
      console.log(data);
      var resp = axios({method:'POST',url:'http://localhost:8080/api/transaction/',data:data}) 
      .then(function (response) {
        console.log(response);
        const data = response.data;
        setWallet(data.Balance);
        set({Valor:data.Balance});
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    function handleChange({target}){
      input[target.name] = target.value;
      setInput(input);
    }

    function handleSubmit_DP(){
      const ret = Depositar();
    }

    function handleSubmit_LV(){
      const ret = Levantar();
    }

    function on() {
        document.getElementById("overlay").style.display = "block";
      }
      
      function off() {
        document.getElementById("overlay").style.display = "none";
      }

  return (
    <>

      <div className = "box">
        <div className = "loginbox">
          <div className='bemvindo'>
            <p>Wallet</p>
            <p>Montante:{}</p>
            <Form>
              <input style={{"width":"30%"}}type="text" name="Valor" placeholder='Montante a depositar' onChange={handleChange}/>
              <button style={{"margin":"10px"}} onClick={()=>handleSubmit_DP()}>+</button>
              <button style={{"margin":"10px"}} onClick={()=>handleSubmit_LV()}>-</button>
            </Form>
          </div>
          {/*
          <div id="overlay" onclick="off()">
            <div id="text">Overlay Text</div>
          </div>
          
          <button className = "button" style={{"margin-right":"30vh","margin-left":"30vh","width":"40%"}} onclick="on()">Depositar</button>
          */}
        </div>
      </div>
    </>
  );
}