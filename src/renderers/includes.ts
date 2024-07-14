import * as readline from 'readline';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { logger } from '../logger';

const INCLUDE_DIRECTIVE = /^\s*!(include(?:sub)?)\s+(.+?)(?:!(\w+))?$/i;
const STARTSUB_TEST_REG = /^\s*!startsub\s+(\w+)/i;
const ENDSUB_TEST_REG = /^\s*!endsub\b/i;

const START_DIAGRAM_REG = /(^|\r?\n)\s*@start.*\r?\n/i;
const END_DIAGRAM_REG = /\r?\n\s*@end.*(\r?\n|$)(?!.*\r?\n\s*@end.*(\r?\n|$))/i;

export async function resolveIncludes(raw: string) {
  let result = "";
  const processedFiles = new Set<string>();
  for await (const line of readLines(raw)) {
    let directiveFilename = getDirectiveFilename(line);
    if (directiveFilename) {
      resolveContent(directiveFilename as string, result, processedFiles);
    }
    result += line;
  }
  return result;
}

async function resolveContent(name: string, result: string, processedFiles: Set<string>) {
  for await (const line of readFileLines(name, processedFiles)) {
    let directiveFilename = getDirectiveFilename(line);
    if (directiveFilename) {
      resolveContent(directiveFilename as string, result, processedFiles);
    }
    result += line;
  }
  return result;
}

function getDirectiveFilename(line: string): string | undefined {
  const match = INCLUDE_DIRECTIVE.exec(line);
  return match && match[1] ? match[1] : undefined;
}

async function* readLines(input: string): AsyncGenerator<string> {
  const lines = input.split(/\r?\n/);
  for (const line of lines) {
    yield line;
  }
}

async function* readFileLines(name: string, processedFiles: Set<string>, chain: string[]): AsyncGenerator<string> {
  chain.push(name);
  const config = vscode.workspace.getConfiguration('plantuml');
  const diagramsRoot = config.get<string>('diagramsRoot');
  const jebbPaths = config.get<string[]>('includepaths') ?? [];
  const printPaths = vscode.workspace.getConfiguration('print').get<string[]>("includePaths") ?? [];

  const directories = [diagramsRoot, ...jebbPaths, ...printPaths].filter(Boolean) as string[];

  for (const dir of directories) {
    const filePath = path.join(dir, name);
    if (processedFiles.has(filePath)) {
      logger.warn("Circular reference", chain);
      chain.pop();
      return;
    } else {
      try {
        await fs.promises.access(filePath);
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

        for await (const line of rl) {
          yield line;
        }
        chain.pop();
        return;
      } catch {
        // Continue to the next directory if the file is not found
      }
    }
  }
  chain.pop();
}
