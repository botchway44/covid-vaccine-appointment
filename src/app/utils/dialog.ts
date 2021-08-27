import { ISession, Session } from "../../models/session";
import { MailerService } from "../mailer.service";
import { MongoClientConnection } from "../mongo-connector";

export class Dialog {
   
   constructor(
      public mongoClient: MongoClientConnection
    ) {
       
   }
   
   
  async verify_code(ssid : string,code: string) {
     const res = await this.mongoClient.findSession(ssid) as ISession;
      
     if(res && (res.code+"" === code+"")){
         // update session as verified
         res.verified = true;
         return true;
     }

     return false
  }

   async getStarted(id: string) {
      
      
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

   async verifyEmail(id : string, email: string){
       const res = await this.mongoClient.findSession(id) as ISession;
       console.log("res ::: ", res);

      if (!res) {
         return false;
      }
      
      res.email = email;
      res.verified = true;  
       const updated = await this.mongoClient.updateSession(id, res);
      // update the session with the id


      console.log("UPDATED ::: ", updated);
      if(updated?.result?.ok){
         // send verification
         MailerService.sendEmail(email, res.code);
         console.log("UPDATE COMPLETE:::::::::::::::::::::::")
      }
      else{
         // update failed
         console.log("UPDATE FAILED:::::::::::::::::::::::")
         return false;
      }

      return true;
    }
}