import * as _sodium from 'libsodium-wrappers';
import { encryptFile } from './encrypt';
import { randomBytes } from 'crypto';
import { decryptFile } from './decrypt';
import { existsSync } from 'fs';
import { createInterface } from 'readline';
import { encryptFileAES } from './aes-encrypt';
import { decryptFileAES } from './aes-decrypt';


function askQuestion(query : string) {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise<string>(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
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

			console.log('Public Nonce: ', ivPublic.toString('hex'));
			console.log('Private Nonce: ', iv.toString('hex'));
			console.log('Key: ', key.toString());
		
			encryptFile(sodium, key, iv, argsProcessed[1], ivPublic);
		
		break;
		case 'encryptAES':
			console.log('Key: ', key.toString());
			encryptFileAES(key,  argsProcessed[1] )
			break;
		case 'decrypt':
            let  inputKey :number[];
            let inputIV,inputPublicIV:string;
			inputKey = (await askQuestion(`Enter the key for decrypting ${argsProcessed[1]} `))?.split(",").map(number => parseInt(number))
			inputPublicIV =  (await askQuestion(`Enter the Public IV for decrypting ${argsProcessed[1]} `))
			inputIV =  (await askQuestion(`Enter the private IV for decrypting ${argsProcessed[1]} `))
			
			decryptFile(
				sodium,
				Uint8Array.from(inputKey),
				Buffer.from(inputIV,'hex'),
				argsProcessed[1],
				Buffer.from(inputPublicIV,'hex')
			);
		
			break;
		case 'decryptAES':
			const inputKeyAES = (await askQuestion(`Enter the key for decrypting ${argsProcessed[1]} `))?.split(",").map(number => parseInt(number))
		
			decryptFileAES(Uint8Array.from(inputKeyAES),	argsProcessed[1])
			
			break;
        default:
            throw new Error("parameter should be either encrypt or decrypt")
	}
})();
