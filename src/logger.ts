import { Metadata } from './metadata';
import * as winston from "winston";
import * as vscode from "vscode";
import * as path from "path";

const logFileName = `vscode-print.log`;
const logFileDir = path.resolve(path.join(`${Metadata.ExtensionPath}`, ".."));
const logLevel = vscode.workspace.getConfiguration("print.general").get<string>("logLevel");

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

