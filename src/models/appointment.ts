import { IHOSPITAL } from "../app/utils/hospitals";

export interface IAppointment{
    email : string,
    location : any,
    quantity : number
    date : any,
  time: any,
  hospital: IHOSPITAL,
}

export class Appointment{

    constructor(
      public email : string,
      public location: string,
      public hospital: IHOSPITAL,
      public quantity : number,
      public date : IDateTime | string,
      public time : IDateTime | string,
    ){}
}
  

export interface IDateTime{
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
  seconds: number,
  nano : number
}