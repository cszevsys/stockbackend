import nodemailer from "nodemailer"
import { ConnectionTimeoutError, createClient } from 'redis';
import { logger } from "../../logger.js";

function sendEmail(fromEmail, toEmail, ccEmail, subject, content, filename, path) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    var mailOptions = {
        to: toEmail,
        subject: subject,
        text: content,
    };

    if(filename && path){
        mailOptions['attachments'] = [{ filename: filename, path: path }]
        logger.info('Sending ' + filename + ' to ' + toEmail)
    }

    logger.info('Sending ' + subject + ' to ' + toEmail)

    return transporter.sendMail(mailOptions)
};

function getQueryParameters(query) {
    var page        = parseInt(query.page) || 1  
    var size        = parseInt(query.size) || 10
    var sortBy      = query.sortBy || '_id'; // Default to sorting by _id field
    var sortOrder   = parseInt(query.sortOrder) || 1; // Default to ascending order
    var searchField = query.field ? query.field.split(",") : []; // Default to empty array
    var searchQuery = query.search || ''; // Default to empty string
    var filter      = query.filter ? query.filter : ''; // Default to no filter
    var filterId    = query.filterId ? query.filterId : ''; // Default to no filter

    return [page, size, sortBy, sortOrder, searchField, searchQuery, filter, filterId];
};

async function redisCache() {
    const prefix    = "redis://";
    const auth      = `:${process.env.REDIS_PASSWORD}@`;
    const baseUrl   = `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
    const redisUrl  = process.env.REDIS_PASSWORD == null ? prefix + baseUrl : prefix + auth + baseUrl;

    const client    = createClient({ url: redisUrl });

    client.on("error", err => {
        throw new ConnectionTimeoutError(`Redis Client Error, ${err}`);
    });

    await client.connect();
    return client;
};

const utils = {
    sendEmail,
    getQueryParameters,
    redisCache
};

export default utils;