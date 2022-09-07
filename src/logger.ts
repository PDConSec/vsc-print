import { extensionPath } from './extension-path';
import * as winston from "winston";

const dt = new Date().toISOString().replace(/\:/g, "-");
const logFileName = `${dt}_info.log`;
const debugLogFileName = `${dt}_debug.log`;
const logFileDir = `${extensionPath}/logs`;

export const logger: winston.Logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.simple(),
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
	),
	transports: [
		new winston.transports.File({
			level: 'info',
			dirname: logFileDir,
			filename: logFileName
		}),
		new winston.transports.File({
			level: 'debug',
			dirname: logFileDir,
			filename: debugLogFileName
		}),
	]
});

