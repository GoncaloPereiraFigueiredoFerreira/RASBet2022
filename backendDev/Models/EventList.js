
// For this class we will be using the Singleton pattern since we are only interested in having one instance of the event list

let instance = undefined

class EventList{

    constructor(){}

    static getInstance(){
        if (instance == undefined){
            instance = new EventList();
        }
        return instance;
    }
}

module.exports = EventList;