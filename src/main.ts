import * as _sodium from 'libsodium-wrappers';
import { encryptFile } from './encrypt';
import { randomBytes } from 'crypto';
import { decryptFile } from './decrypt';
import { existsSync } from 'fs';
import { createInterface } from 'readline';
import { encryptFileAES } from './aes-encrypt';
import { decryptFileAES } from './aes-decrypt';
import { readKeyFromFile, saveKeyToFile } from './util/util';
import { keyFileName } from './util/constants';
function askQuestion(query: string) {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout
	});

	return new Promise<string>((resolve) =>
		rl.question(query, (ans) => {
			rl.close();
			resolve(ans);
		})
	);
}
(async () => {
	await _sodium.ready;
	const sodium = _sodium;
	const argsProcessed = process.argv.slice(2);
	if (!existsSync(argsProcessed[1])) throw new Error('file not found');

	const key = sodium.crypto_aead_xchacha20poly1305_ietf_keygen();
	switch (argsProcessed[0]) {
		case 'encrypt':
			var iv = randomBytes(32);
			var ivPublic = randomBytes(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
			saveKeyToFile(
				{
					key: key.toString(),
					iv: iv.toString('base64'),
					publicIV: ivPublic.toString('base64'),
					type: 'XChaCha20',
					fileName: argsProcessed[1]
				},
				keyFileName
			);
			encryptFile(sodium, key, iv, argsProcessed[1], ivPublic);

			break;
		case 'encryptAES':
			saveKeyToFile({ key: key.toString(), type: 'AES', fileName: argsProcessed[1] }, keyFileName);

			encryptFileAES(key, argsProcessed[1]);

			break;
		case 'decrypt': {
			const { inputKey, inputIV, inputPublicIV } = readKeyFromFile(keyFileName);
			decryptFile(sodium, inputKey, inputIV, argsProcessed[1], inputPublicIV);

			break;
		}
		case 'decryptAES':
			const { inputKey } = readKeyFromFile(keyFileName);
			decryptFileAES(inputKey, argsProcessed[1]);

			break;
		default:
			throw new Error('parameter should be either encrypt or decrypt');
	}
})();
