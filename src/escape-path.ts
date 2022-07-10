export function escapePath(path: string) {
	switch (process.platform) {
		case "win32":
			return path.includes('"') || !path.includes(" ") ? path : `"${path}"`;
		default:
			return path.replace(/ /g, "\\ ");
	}
}