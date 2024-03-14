import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from 'morgan'
import  { winstonLogger } from './logger.js'
import { v4 as uuidv4 } from 'uuid';
import { createNamespace } from 'cls-hooked';
import db from "./src/database/db.js";
import authRouter from "./src/router/authRouter.js";
import companyRouter from "./src/router/company/companyRouter.js";

const app = express();
dotenv.config();
app.use(cors({ origin: true }));

// morgan + winston logging
app.use(morgan(':method :url :status - :response-time ms',{ "stream": winstonLogger.stream }));

// create uuid
var myRequest = createNamespace('appName');

app.set('trust proxy', true)

// Run the context for each request. Assign a unique identifier to each request
app.use(function(req, res, next) {
  var ip  = req.headers['x-real-ip'] ||
            req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress ||
            req.ip ||
            null;
    myRequest.run(function() {
        myRequest.set('reqId', uuidv4());
        myRequest.set('ipAddr', ip);
        myRequest.set('key', req.headers["key"]);
        next();
    });
});

// parse requests of content-type - application/json
app.use(express.json({
  type: "*/*" // optional, only if you want to be sure that everything is parsed as JSON. Wouldn't recommend
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

db.connect();

// routes
app.use("/api/auth", authRouter);
app.use("/api/company", companyRouter);
// set port, listen for requests
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
