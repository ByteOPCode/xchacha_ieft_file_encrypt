import * as _sodium from 'libsodium-wrappers';
import { createReadStream, createWriteStream, statSync } from 'fs';
import { blockSize } from './constants';
import { convertBytes } from './util/util';

/**
 * @name encryptFile
 * @param sodium instance of sodium
 * @param key Array of 32byte key
 * @param iv Buffer of Private Nonce or Initialization Vector
 * @param filePath File existence path 
 * @param publicIV Buffer of Public Nonce or Public Initialization vector
 * @returns {void}
 */

export const encryptFile = (
	sodium: typeof _sodium,
	key: Uint8Array,
	iv: Buffer,
	filePath: string,
	publicIV: Buffer
) => {
	var startTime: number, endTime: number;

	const input = createReadStream(filePath, { highWaterMark: blockSize });
	const output = createWriteStream(`${filePath}.enc`, { highWaterMark: blockSize });
	const fileSize = statSync(filePath).size;
	startTime = performance.now();

	input.on('open', () => {
		startTime = performance.now();
	});

	try {
		input.on('data', (data) => {
			const bufferValue = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(data, null, iv, publicIV, key);

			output.write(bufferValue);
		});
	} catch (error) {
		console.error(error);
	}
	input.on('end', () => {
		endTime = performance.now();
		console.log(`Encryption of  ${filePath} using  Xchacha20Poly1305-IEFT of size ${convertBytes(fileSize)} MB took ${endTime - startTime} milliseconds  `);
		process.exit(0);
	});
};
