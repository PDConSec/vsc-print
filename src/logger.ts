import { extensionPath } from './extension-path';
import * as winston from "winston";
import * as vscode from "vscode";

const logFileName = `vscode-print.log`;
const logFileDir = `${extensionPath}`;
const logLevel = vscode.workspace.getConfiguration("print", null).logLevel;

const transports = [
	new winston.transports.File({
		level: logLevel,
		dirname: logFileDir,
		filename: logFileName
	}),
]
export const logger: winston.Logger = winston.createLogger({
	level: logLevel,
	format: winston.format.combine(
		winston.format.simple(),
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
	),
	transports: transports
});

