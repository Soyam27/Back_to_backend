import { app } from './app.js';
import { DB_NAME } from './constants.js';
import { connectDb } from './db/index.js';
import dotevn from "dotenv";

dotevn.config({
    path: './.env'
})

connectDb(`${process.env.MONGODB_URI}/${DB_NAME}`)
    .then(() => {
        app.on('error', (error) => {
            console.log("ERR: " + error);
            throw error;
        }),
            app.listen(process.env.PORT || 8000, () => {
                console.log("APP IS LISTENING ON PORT " + process.env.PORT);
            })
    }
    )
    .catch((err) => {
        console.log("DB CONNECTION FAILED!", err)
    });

