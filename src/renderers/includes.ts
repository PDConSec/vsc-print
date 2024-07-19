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
      result += await resolveInclude(includeFilepath, processedFiles, chain, rootDocFolder);
    } else {
      result += `${line}\n`;
    }
  }
  return result;
}

async function resolveInclude(filepath: string, processedFiles: Set<string>, chain: string[], rootDocFolder: string) {
  let result = "";
  if (chain.includes(filepath)) {
    logger.warn("Include cycle for {filepath}, chain is {chain}", filepath, chain);
  } else if (processedFiles.has(filepath)) {
    logger.warn("Already included {filepath}", filepath);
  } else {
    processedFiles.add(filepath);
    chain.push(filepath);
    for await (const line of readFileLines(filepath)) {
      let includeFilename = await getIncludeFilepath(line, rootDocFolder);
      if (includeFilename) {
        result += await resolveInclude(includeFilename, processedFiles, chain, rootDocFolder);
      } else if (line.includes("@startuml")) {
        continue;
      } else if (line.includes("@enduml")) {
        break;
      } else {
        result += `${line}\n`;
      }
    }
    chain.pop();
  }
  return result;
}

async function getIncludeFilepath(line: string, rootDocFolder: string) {
  const match = INCLUDE_DIRECTIVE.exec(line);
  const filename = match && match[2] ? match[2] : undefined;
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

async function* readFileLines(filePath: string): AsyncGenerator<string> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  for await (const line of rl) {
    yield line;
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