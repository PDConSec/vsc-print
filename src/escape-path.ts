export function escapePath(path: string) {
	switch (process.platform) {
		case "win32":
			return encodeURI(path);	
		default:
			return path.replace(/ /g, "\\ ");
	}
}