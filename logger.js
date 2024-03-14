import * as winston from 'winston'
import * as path from 'path';
import { fileURLToPath } from 'url';
import { getNamespace } from 'cls-hooked';
import  'winston-daily-rotate-file';

var PROJECT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const { splat, combine, timestamp, printf } = winston.format;

// setting the logging format
const myFormat = printf((info) => {
    const { timestamp, level, message, meta } = info;
        return `${timestamp} | ${level.toUpperCase()} | ${message}`;
});

// create winston logger
var winstonLogger = winston.createLogger({
    format: combine(
        timestamp({format: 'HH:mm:ss.SSS'}),
        splat(),
        myFormat
    ),
    defaultMeta: 'appName',
    transports: [
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: false
        }),
        new winston.transports.DailyRotateFile({
            filename: `logs/multihub-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '20m',
            maxFiles: '100d',
            level: 'debug',
          })
    ],
    exitOnError: false
});

// Parses and returns info about the call stack at the given index.
function getStackInfo (stackIndex) {
    // get call stack, and analyze it
    // get all file, method, and line numbers
    var stacklist = (new Error()).stack.split('\n').slice(3);

    // stack trace format:
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
    var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

    var s = stacklist[stackIndex] || stacklist[0];
    var sp = stackReg.exec(s) || stackReg2.exec(s);
    
    if (sp && sp.length === 5) {
        return {
            method: sp[1],
            relativePath: path.relative(PROJECT_ROOT, sp[2]).replace("file:",""),
            line: sp[3],
            pos: sp[4],
            file: path.basename(sp[2]),
            stack: stacklist.join('\n')
        }
    }
}

// Attempts to add file and line number info to the given log arguments.
function formatLogArguments (args, appName, logFormat = "api", isHttp = false) {
    args = Array.prototype.slice.call(args)

    var stackInfo = getStackInfo(1)

    if (stackInfo) {
        // get file path relative to project root
        var calleeStr = stackInfo.relativePath + ':' + stackInfo.line;
        
        // Wrap Winston logger to print reqId in each log
        var myRequest = getNamespace(appName);
        
        var uuid, pubKey, ip
        if(myRequest.active == null){
            uuid = null + " | ";
            pubKey = null + " | ";
            ip = null + " | ";
        }
        else{
            uuid = myRequest.get('reqId').replace(/-/g, "") + " | ";
            pubKey = myRequest.get('key') + " | ";
            ip = myRequest.get('ipAddr') + " | ";
        }
        var filePath = uuid;
        if(logFormat == "api") {
            filePath = ip + pubKey + filePath;
        }
        if(!isHttp) {
            filePath = filePath + calleeStr + ' - ';
        } 

        if (typeof (args[0]) === 'string') {
        args[0] = filePath + args[0];
        } else {
        args.unshift(filePath);
        }
    }
    return args;
}

// A custom logger interface that wraps winston, making it easy to instrument
// code and still possible to replace winston in the future.
var logger = {
    log: function(level) {
        winstonLogger.log(level, formatLogArguments(arguments, winstonLogger.defaultMeta));
    },
    error: function() {
        winstonLogger.error(formatLogArguments(arguments, winstonLogger.defaultMeta));
    },
    warn: function() {
        winstonLogger.warn(formatLogArguments(arguments, winstonLogger.defaultMeta));
    },
    verbose: function() {
        winstonLogger.verbose(formatLogArguments(arguments, winstonLogger.defaultMeta));
    },
    info: function() {
        winstonLogger.info(formatLogArguments(arguments, winstonLogger.defaultMeta));
    },
    debug: function() {
        winstonLogger.debug(formatLogArguments(arguments, winstonLogger.defaultMeta));
    },
    http: function() {
        winstonLogger.info(formatLogArguments(arguments, winstonLogger.defaultMeta, true));
    },
    silly: function() {
        winstonLogger.silly(formatLogArguments(arguments, winstonLogger.defaultMeta));
    }
};

function cronLogger(appName) {
    // create winston logger
    var cronLog = winston.createLogger({
        format: combine(
            timestamp({format: 'HH:mm:ss.SSS'}),
            splat(),
            myFormat
        ),
        defaultMeta: appName,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true
            }),
            new winston.transports.DailyRotateFile({
                filename: `logs/cron/${appName}-%DATE%.log`,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: false,
                maxSize: '20m',
                maxFiles: '100d',
                level: 'debug',
              })
        ],
        exitOnError: false
    });

    // A custom logger interface that wraps winston, making it easy to instrument
    // code and still possible to replace winston in the future.
    var clogger = {
        log: function(level) {
            cronLog.log(level, formatLogArguments(arguments, cronLog.defaultMeta, "cronJob"));
        },
        error: function() {
            cronLog.error(formatLogArguments(arguments, cronLog.defaultMeta, "cronJob"));
        },
        warn: function() {
            cronLog.warn(formatLogArguments(arguments, cronLog.defaultMeta, "cronJob"));
        },
        verbose: function() {
            cronLog.verbose(formatLogArguments(arguments, cronLog.defaultMeta, "cronJob"));
        },
        info: function() {
            cronLog.info(formatLogArguments(arguments, cronLog.defaultMeta, "cronJob"));
        },
        http: function() {
            cronLog.info(formatLogArguments(arguments, cronLog.defaultMeta, "cronJob", true));
        },
        debug: function() {
            cronLog.debug(formatLogArguments(arguments, cronLog.defaultMeta, "cronJob"));
        },
        silly: function() {
            cronLog.silly(formatLogArguments(arguments, cronLog.defaultMeta, "cronJob"));
        }
    };
    return clogger;
}

// this allows winston to handle output from express' morgan middleware
winstonLogger.stream = {
    write: function(message){
        logger.http(message.slice(0, -1));
  }
}

export { cronLogger, logger, winstonLogger } ;
