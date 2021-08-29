import { Appointment, IDateTime } from "../../models/appointment";
import { ISession, Session } from "../../models/session";
import { MailerService } from "../mailer.service";
import { MongoClientConnection } from "../mongo-connector";
import { formatDate } from "./date";

export class Dialog {
   
   constructor(
      public mongoClient: MongoClientConnection,
      public mailerService: MailerService
   ) { }
       


   async createAppointment(appointment: Appointment, ssid:string) {
      const res = await this.mongoClient.findSession(ssid) as ISession;

      if (!res) {
         var val = Math.floor(1000 + Math.random() * 9000);

         // create a new session
         const session = new Session(ssid,false, val+"")
         const res = await this.mongoClient.addSession(session);
      }

      const results = await this.mongoClient.addAppointment(appointment);
      if (results?.result?.ok) {
         console.log("Appointment created::SENDING EMAIL");
         // Email Appointment Details to user
         // modify the date strings to be in the correct format
         const date = formatDate(appointment.date as IDateTime);
         appointment.date = date;
         this.mailerService.sendAppointDetailsEmail(appointment.email, appointment);

         return true;
      }

      return false;
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

   
   async verifyDateTime(sessionId: string, date: any) {
      const res = await this.mongoClient.findSession(sessionId) as ISession;

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
         this.mailerService.sendConfirmationEmail(email,{ code : res.code});
         console.log("UPDATE COMPLETE:::::::::::::::::::::::")
      }
      else{
         // update failed
         console.log("UPDATE FAILED:::::::::::::::::::::::")
         return false;
      }

      return true;
   }

   async checkAppointment(email:string) {
      const res = await this.mongoClient.findAppointment(email);
      if (res) {
         return res;
      }
      return null;
   }
}