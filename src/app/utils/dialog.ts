import { Session } from "../../models/session";
import { MongoClientConnection } from "../mongo-connector";

export class Dialog {

    constructor(
        public mongoClient: MongoClientConnection
    ) {

    }



   async getStarted(id: string){
     const session =  await  this.mongoClient.findSession(id);

     if(session){
        console.log(session)
     }else{
        //  create a new session
        var val = Math.floor(1000 + Math.random() * 9000);
        console.log(val);
        const session = new Session(id,false, val+"")
     }
    }
}