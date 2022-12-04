import {Form} from "react-router-dom"
import {useState} from "react"
import axios from "axios"
import {getDate,getToken} from "../utils"

    /**
     * Component that render the wallet page
     * @returns Returns HTML for the component 
     */

export default function Wallet() {
    const [input,setInput] = useState({Valor:0});

    /**
     * Post request to add more funds to the user account
     * @returns Returns True if Post sucessed or error data
     */

    function Levantar(){
      var data={Valor:input.Valor,Tipo:"Levantamento_Conta",ApostadorID:getToken(),DataTr:getDate()};
      var resp = axios({method:'POST',url:'http://localhost:8080/api/transaction/',data:data}) 
      .then(function (response) {
        const data = response.data;
        //setWallet(data.Balance);
        //set({Valor:data.Balance});
      })
      .catch(function (error) {
      });
    }

    /**
     * Post request to remove funds from the user account
     * @returns Returns True if Post sucessed or error data
     */

    function Depositar(){
      var data={Valor:input.Valor,Tipo:"Deposito_Conta",ApostadorID:getToken(),DataTr:getDate()};
      var resp = axios({method:'POST',url:'http://localhost:8080/api/transaction/',data:data}) 
      .then(function (response) {
        const data = response.data;
        //setWallet(data.Balance);
        //set({Valor:data.Balance});
      })
      .catch(function (error) {
      });
    }

  /**
   * Handle changes in the input fields 
   * @param input field that changed
   */

    function handleChange({target}){
      input[target.name] = target.value;
      setInput(input);
    }

  /**
   * Handle submit of a form, send deposit request
   */

    function handleSubmit_DP(){
      const ret = Depositar();
    }

  /**
   * Handle submit of a form, send withdraw request
   */

    function handleSubmit_LV(){
      const ret = Levantar();
    }

    function on() {
      document.getElementById("modo").style.display = "flex";
      }
      
    function off() {
      document.getElementById("modo").style.display = "none";
    }

    function onMBW() {
      document.getElementById("mbway").style.display = "flex";

    }
      
    function offMBW() {
      document.getElementById("mbway").style.display = "none";
    }

    function onMB() {
      document.getElementById("multibanco").style.display = "flex";

    }
      
    function offMB() {
      document.getElementById("multibanco").style.display = "none";
    }

    function onDep() {
      document.getElementById("depositar").style.display = "flex";
      offRet();
    }
      
    function offDep() {
      document.getElementById("depositar").style.display = "none";
    }

    function onRet() {
      document.getElementById("retirar").style.display = "flex";
      offDep();
    }
      
    function offRet() {
      document.getElementById("retirar").style.display = "none";
    }

    function onS() {
      document.getElementById("selected").style.display = "flex";
    }
      
    function offS() {
      document.getElementById("selected").style.display = "none";
    }

  return (
    <>

      <div className = "box" style={{"marginTop":"20px","paddingTop":"20px"}}>
        <div className = "loginbox" >
          <div className='bemvindo'>
            <p>Wallet</p>
          </div>
          
          <div id="overlay">
            <div id="text">Overlay Text</div>
          </div>

          <button className = "button" style={{"borderRadius":"10px","marginRight":"30%","marginLeft":"30%","width":"40%"}} onClick={()=>{on();onRet()}}>Retirar</button>
          <button className = "button" style={{"borderRadius":"10px","marginRight":"30%","marginLeft":"30%","marginTop":"10px","width":"40%"}} onClick={()=>{on();onDep()}}>Depositar</button>

          <div id="modo" style={{"display":"none","justifyContent":"center","flexDirection":"column","marginTop":"20px"}}>
            <p>Selecionar modo:</p>
            <div style={{"justifyContent":"center","flexDirection":"row"}}>
              <img src="/MBway.png" style={{"margin":"auto"}} onClick={()=>{onS();onMBW()}}></img>
              <img src="/multibanco.png" style={{"borderRadius":"20px","margin":"auto"}} onClick={()=>()=>{onS();onMB()}}></img>              
            </div>
          </div>

          <div id="selected" style={{"display":"none","justifyContent":"center","marginTop":"20px"}}>
            <Form id="selected" style={{"justifyContent":"center","marginTop":"20px"}}>
              <input style={{"width":"100%"}} type="text" name="Valor" placeholder='Montante €' pattern="\d*(\.\d{1,2}|)" onChange={handleChange}/>
              <div id="mbway" style={{"display":"none"}}>
                <input style={{"display":"flex","width":"100%"}} type="text" name="Valor" placeholder='Nº de telemovel' pattern="\d*(\.\d{1,2}|)"/>
              </div>
              <div id="multibanco" style={{"display":"none"}}>
                <input style={{"display":"flex","width":"100%"}} type="text" name="Valor" placeholder='IBAN' pattern="\d*(\.\d{1,2}|)"/>
              </div>
              <button id="depositar"  style={{"display":"none","display":"none", "backgroundColor":"red","width":"50%","marginLeft":"25%","textAlign":"center"}} onClick={()=>handleSubmit_DP()}>Depositar</button>
              <button id="retirar"    style={{"display":"none","backgroundColor":"red","width":"50%","marginLeft":"25%","textAlign":"center"}} onClick={()=>handleSubmit_LV()}>Retirar</button>
            </Form>
          </div>

        </div>
      </div>
    </>
  );
}