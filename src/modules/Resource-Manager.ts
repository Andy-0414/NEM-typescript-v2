import path from "path";
import { promises as fs } from "fs";
/**
 * @description 리소스를 관리하는 모듈입니다.
 */
class ResourceManager {
	public defaultPath = "public/";
	/**
	 * @description /public/${folderPath}/${filename} 에 file을 저장합니다.
	 */
	public async save(folderPath: string, filename: string, file: Buffer): Promise<string> {
		// file path
		let filepath = path.join(this.defaultPath, folderPath, filename);
		try {
			// 파일 상태
			let tFile = await fs.stat(filepath);
			// 파일이 있으면
			if (tFile.isFile()) {
				// 파일 삭제
				await fs.unlink(filepath);
			}
		} catch {}
		try {
			// 파일 쓰기
			await fs.writeFile(filepath, file);
			// 파일 경로 반환
			return path.join(folderPath, filename);
		} catch (err) {
			throw err;
		}
	}
}
export default new ResourceManager();
