import { createReadStream, createWriteStream, statSync } from "fs";
import * as aes  from "../src/extras/aes-pure-js/index"
import { convertBytes, convertTimeToMBPerSecond } from "./util/util";
import { aesCounterIteration, blockSize } from "./constants";
export const encryptFileAES = (
	
	key: Uint8Array,
	
	filePath: string,
	) => {
	var startTime: number, endTime: number;

    var aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(aesCounterIteration));
	const input = createReadStream(filePath, { highWaterMark: blockSize });
	const output = createWriteStream(`${filePath}.aes`, { highWaterMark: blockSize });
	const fileSize = statSync(filePath).size;
	input.on('open', () => {
		startTime = performance.now();
	});

    input.on('data', (textBytes:Buffer) => {
    const encryptedBytes = aesCtr.encrypt( textBytes);
    output.write(encryptedBytes);
    })
    input.on('end', () => {
		endTime = performance.now();
		
		const totalDuration = endTime - startTime
		console.log(`AES, Encrypt, ${filePath}, ${convertBytes(fileSize)}, ${totalDuration} , ${convertTimeToMBPerSecond(fileSize,totalDuration)}`)
		//return (`AES, "Encrypt", ${filePath}, ${convertBytes(fileSize)}, ${totalDuration} , ${totalDuration/(fileSize/1024)}`)
	
	});

}
