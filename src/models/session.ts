export interface ISession{
    id : string,
    verified : boolean,
    code : string
}


export class Session implements ISession{
    constructor(
        public id : string,
        public verified : boolean,
        public code: string
        ){

    }
}