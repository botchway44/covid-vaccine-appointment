import { Collection } from "mongodb";
import { IAppointment } from "../models/appointment";
import { ISession } from "../models/session";

const MongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
require("dotenv").config();

/**
 * A thin MongoClientConnection Wrapper
 * Todo : Make class generic, separate mongo specific from repository specific operations
 */
export class MongoClientConnection {
    public sessions_db_name = 'sessions';
    public appointments_db_name = 'appointments';
    public db_name = 'appointment';

    appointments_collection?: Collection | undefined;
    sessions_collection?:Collection | undefined;

    mongo_url = process.env.MONGODB_URL;


    constructor() {
    }

    connect() {

        console.log("Connecting to Databse ... ")
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.mongo_url, { useUnifiedTopology: true }, async (
                err: any,
                client: any
            ) => {
                // throw error
                if (err) { reject(err); throw err; };

                // log connected
                console.log('connecting...');
                this.appointments_collection = await client.db(this.db_name).collection(this.appointments_db_name);
                this.sessions_collection = await client.db(this.db_name).collection(this.sessions_db_name);

                resolve(true)
            });
        });



    }

    async addAppointment(appointment: IAppointment) {
        return await this.appointments_collection?.insertOne(appointment);
    }


    async addSession(session: ISession) {
        return await this.sessions_collection?.insertOne(session);
    }

    async removeAppointment(appointment: IAppointment) {
        return await this.appointments_collection?.deleteOne({ email: appointment.email });
    }

    async updateAppointment(appointment: IAppointment) {
        return await this.appointments_collection?.updateOne({ email: appointment.email }, { $set:appointment },{  upsert: true});
    }

    getAllAppointments(email: string) {
        return this.appointments_collection?.find({ email: email }).toArray() || [];
    }

    findAppointment(email: string) {
        return this.appointments_collection?.findOne({email : email});
    }

    findSession(id: string) {
        return this.sessions_collection?.findOne({id : id});
    }

    updateSession(id: string, session : ISession) {
        return this.sessions_collection?.updateOne({ id: id }, {$set: session},{  upsert: true} );
    }
    getAppointment(id: string, email: string) {
        return this.appointments_collection?.findOne({ id: id, email: email });
    }

    async removeAllAppointments() {
        return await this.appointments_collection?.deleteMany({});
    }



}