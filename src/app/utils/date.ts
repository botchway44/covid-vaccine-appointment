import { IDateTime } from "../../models/appointment";


export const formatDate = (date: IDateTime) => {
    if(date.hours){
      return `${date.year}-${date.month}-${date.day} ${date.hours}:${date.minutes}:${date.seconds}`;
    } else {
        return `${date.year}-${date.month}-${date.day}`;
    }
};
