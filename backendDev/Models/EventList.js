
let instance = undefined

class EventList{

    constructor(){}

    getInstance(){
        if (instance == undefined){
            instance = new EventList();
        }
        return instance;
    }
}