export interface IAppointment{
    email : string,
    location : any,
    quantity : number
    date : any,
    time : any,
}

export class Appointment{

    constructor(
      public email : string,
      public location : string,
      public quantity : number,
      public date : any,
      public time : any
    ){}
}