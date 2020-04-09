import path from "path";
import { promises as fs } from "fs";
class ResourceManager {
	defaultPath = "public/";
	async save(folderPath: string, filename: string, file: Buffer): Promise<string> {
		let filepath = path.join(this.defaultPath, folderPath, filename);
		try {
			let tFile = await fs.stat(filepath);
			if (tFile.isFile()) {
				await fs.unlink(filepath);
			}
		} catch {}
		try {
			await fs.writeFile(filepath, file);
			return path.join(folderPath, filename);
		} catch (err) {
			throw err;
		}
	}
}
export default new ResourceManager();
