import { Collection } from "mongodb";
import { IAppointment } from "../models/appointment";

const MongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
require("dotenv").config();

/**
 * A thin MongoClientConnection Wrapper
 * Todo : Make class generic, separate mongo specific from repository specific operations
 */
export class MongoClientConnection {
    public tasks_db_name = 'tasks';
    appointments_collection?: Collection | undefined;
    mongo_url = process.env.MONGODB_URL;

    db_name = 'LexVoiceApp';

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
                console.log('connected to database');
                this.appointments_collection = await client.db(this.db_name).collection(this.tasks_db_name);

                resolve(true)
            });
        });



    }

    async addAppointment(appointment: IAppointment) {
        return await this.appointments_collection?.insertOne(appointment);
    }


    async removeAppointment(appointment: IAppointment) {
        return await this.appointments_collection?.deleteOne({ id: appointment.id });
    }

    async updateAppointment(task: IAppointment) {
        return await this.appointments_collection?.updateOne({ id: task.id }, task);
    }

    getAllAppointments(email: string) {
        return this.appointments_collection?.find({ email: email }).toArray() || [];
    }

    find(email: string) {
        return this.appointments_collection?.find({email : email}).toArray();
    }

    getAppointment(id: string, email: string) {
        return this.appointments_collection?.findOne({ id: id, email: email });
    }


    async removeAllAppointments() {
        return await this.appointments_collection?.deleteMany({});
    }



}