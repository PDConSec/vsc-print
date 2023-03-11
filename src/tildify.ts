import * as path from 'path';
import * as os from 'os';

const homeDirectory = os.homedir();

export default function tildify(absolutePath: string) {
	let normalizedPath = path.normalize(absolutePath) + path.sep;
	if (normalizedPath[1] === ":") {
		//force first char to uppercase
		normalizedPath = normalizedPath.replace(normalizedPath[0], normalizedPath[0].toUpperCase());
	}
	let result = normalizedPath;
	if (normalizedPath.startsWith(homeDirectory)) {
		result = normalizedPath.replace(homeDirectory + path.sep, `~${path.sep}`);
	}
	return result.slice(0, -1);
}
