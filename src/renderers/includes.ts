import * as readline from 'readline';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { logger } from '../logger';

const INCLUDE_DIRECTIVE = /^\s*!(include(?:sub)?)\s+(.+?)(?:!(\w+))?$/i;

export async function resolveRootDoc(raw: string, rootDocFolder: string) {
  let result = "";
  const processedFiles = new Set<string>();
  const chain = new Array<string>();
  for await (const line of readLines(raw)) {
    let includeFilepath = await getIncludeFilepath(line, rootDocFolder);
    if (includeFilepath) {
      resolveInclude(includeFilepath, result, processedFiles, chain, rootDocFolder);
    } else {
      result += line;
    }
  }
  return result;
}

async function resolveInclude(filepath: string, result: string, processedFiles: Set<string>, chain: string[], rootDocFolder: string) {
  if (chain.includes(filepath)) {
    logger.warn("Include cycle for {filepath}. Chain is {chain}", filepath, chain);
  } else if (processedFiles.has(filepath)) {
    logger.warn("Already included {filepath}", filepath);
  } else {
    processedFiles.add(filepath);
    chain.push(filepath);
    for await (const line of readFileLines(filepath, rootDocFolder)) {
      let includeFilename = await getIncludeFilepath(line, rootDocFolder);
      if (includeFilename) {
        await resolveInclude(includeFilename, result, processedFiles, chain, rootDocFolder);
      } else if (line.includes("@startuml")) {
        //skip
      } else if (line.includes("@enduml")) {
        break;
      } else {
        result += line;
      }
    }
    chain.pop();
  }
}

async function getIncludeFilepath(line: string, rootDocFolder: string) {
  const match = INCLUDE_DIRECTIVE.exec(line);
  const filename = match && match[1] ? match[1] : undefined;
  if (filename) {
    const filepath = await resolveFilepath(filename, rootDocFolder);
    if (!filename) {
      logger.warn("File \"{filename}\"not found on searchpath", filename);
    }
    return filepath;
  } else {
    return "";
  }
}

async function* readLines(input: string): AsyncGenerator<string> {
  const lines = input.split(/\r?\n/);
  for (const line of lines) {
    yield line;
  }
}

async function* readFileLines(filename: string, rootDocFolder: string): AsyncGenerator<string> {
  const filePath = await resolveFilepath(filename, rootDocFolder);
  if (filePath === "NOT FOUND") {
    logger.error("Include file not found", filename);
  } else if (filePath === "REDUNDANT") {
    logger.error("Already referenced", filePath);
  } else {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    for await (const line of rl) {
      yield line;
    }
  }
}

async function resolveFilepath(name: string, rootDocFolder: string) {
  const config = vscode.workspace.getConfiguration('plantuml');
  const diagramsRoot = config.get<string>('diagramsRoot');
  const jebbPaths = config.get<string[]>('includepaths') ?? [];
  const printPaths = vscode.workspace.getConfiguration('print').get<string[]>("includePaths") ?? [];
  const directories = [rootDocFolder, diagramsRoot, ...jebbPaths, ...printPaths].filter(Boolean) as string[];
  for (let i = 0; i < directories.length; i++) {
    const filePath = path.resolve(path.join(directories[i], name));
    try {
      await fs.promises.access(filePath);
      return filePath;
    } catch { }
  }
  return "";
}