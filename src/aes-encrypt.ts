import { createReadStream, createWriteStream, statSync } from "fs";
import * as aes  from "../src/extras/aes-pure-js/index"
import { convertBytes } from "./util/util";
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
		console.log(`Encrypting based of AES ${filePath} of ${convertBytes(fileSize)} took ${endTime - startTime} milliseconds  `);
		process.exit(0);
	});

}