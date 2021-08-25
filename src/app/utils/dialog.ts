import { ISession, Session } from "../../models/session";
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
       const res = await this.mongoClient.addSession(session);

       if(res?.result?.ok){
          return true;
       }

       return false;
     }
    }

   async verify_email(id : string, email: string){
       const res = await this.mongoClient.findSession(id) as ISession;

       if(res){
         res.email = email;
         res.verified = false;  
       }
     
       const updated = await this.mongoClient.updateSession(id, res);
      // update the session with the id

      if(updated?.result?.ok){
         // send verification
      }
      else{
         // update failed
      }
    }
}