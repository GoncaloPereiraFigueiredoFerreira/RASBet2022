

export class MessageGenerator{

    LOST_GAME_MESSAGE= 0
    WON_GAME_MESSAGE= 1
    CLOSED_GAME_MESSAGE=2
    SUPPER_ODDS_MESSAGE = 3
    ODDS_CHANGED_MESSAGE = 4

    generateMessage(jogo:any,message:any):string{
        let notification:string="mensagem nao gerada";
        switch(message){
            case this.LOST_GAME_MESSAGE:
                notification=`Perdeu a aposta ${jogo}. Não desista e recupere o que perdeu apostando outra vez !!!`
                break;
            case this.WON_GAME_MESSAGE:
                notification=`Parabéns ganhou a aposta ${jogo}!! Vá ao histórico de apostas para ver o resultado.`
                break;
            case this.CLOSED_GAME_MESSAGE:
                notification=`Um evento no qual tinha uma aposta foi fechado e será reembolsado pelo valor apostado!!`
                break;
            case this.SUPPER_ODDS_MESSAGE:
                notification=`A promocao SuperOdds foi aplicada a eventos de ${jogo[0]}, aproveite a oportunidade para apostar!!!`
                break;
            case this.ODDS_CHANGED_MESSAGE:
                let odds=""
                for (let i =0; i<jogo[2].length;i++){
                    odds+=`${jogo[2][i].toFixed(2)}`
                    if (i+1<jogo[2].length) odds+="-"
                }
                notification=`Um evento de ${jogo[0]} que segue mudou as suas odds para [${odds}].`
                break;
        }
        return notification
    }



}